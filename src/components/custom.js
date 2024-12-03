import { gql } from '@apollo/client/core';
import { EventBus } from '@/eventBus'; // Import EventBus

export default {
    data() {
        return {
            currentCardIndex: null,
            startX: 0,
            cardBoxShadow: '0 6px 0px rgba(0, 0, 0, 0.4)', // Default box shadow
        };
    },
    methods: {
        startSwipe(index, event) {
            if (this.currentCardIndex !== null) return;

            this.currentCardIndex = index;
            this.startX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;

            const moveEvent = event.type === 'mousedown' ? 'mousemove' : 'touchmove';
            const endEvent = event.type === 'mousedown' ? 'mouseup' : 'touchend';

            document.addEventListener(moveEvent, this.swipeCard);
            document.addEventListener(endEvent, this.endSwipe);
        },

        swipeCard(event) {
            if (this.currentCardIndex === null) return;

            const currentX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
            const deltaX = currentX - this.startX;

            const currentCard = this.$refs.userCards[this.currentCardIndex];
            const heartIcon = this.$el.querySelector('.action-heart');
            const xIcon = this.$el.querySelector('.action-x');

            if (currentCard) {
                // Apply the swipe effect
                currentCard.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 20}deg)`;

                // Dynamically change box-shadow based on swipe direction
                this.cardBoxShadow = deltaX > 0
                    ? '0 6px 55px rgba(0, 255, 0, 0.5)'  // Green shadow for right swipe
                    : '0 6px 55px rgba(255, 0, 0, 0.5)'; // Red shadow for left swipe

                // Change icon color based on swipe direction
                if (deltaX > 0) {
                    heartIcon.style.color = 'green';  // Heart icon turns green for right swipe
                    xIcon.style.color = 'black';  // X icon stays black for right swipe
                } else {
                    heartIcon.style.color = 'black';  // Heart icon stays black for left swipe
                    xIcon.style.color = 'red';  // X icon turns red for left swipe
                }
            }
        },

        endSwipe(event) {
            if (this.currentCardIndex === null) return;

            const currentX = event.type === 'mouseup' ? event.clientX : event.changedTouches[0].clientX;
            const deltaX = currentX - this.startX;

            if (Math.abs(deltaX) > 150) {
                const direction = deltaX > 0 ? 'right' : 'left';
                this.handleSwipe(direction);
            } else {
                this.resetCard();
            }
        },

        async handleSwipe(direction) {
            if (this.currentCardIndex === null) return;

            const currentCard = this.$refs.userCards[this.currentCardIndex];
            const likedUserId = this.users[this.currentCardIndex].id;
            const currentUserId = this.$store.getters.getUser.id;

            if (currentCard) {
                currentCard.style.transition = 'transform 0.3s ease';
                currentCard.style.transform = `translateX(${direction === 'right' ? 500 : -500}px) rotate(${direction === 'right' ? 30 : -30}deg)`;

                // Clone the user object to make it mutable
                const user = { ...this.users[this.currentCardIndex] }; // Shallow copy
                user.isRemoved = true;  // Mark as removed in the cloned object

                // Update the user in the array with the cloned object
                this.$set(this.users, this.currentCardIndex, user);

                if (direction === 'right') {
                    await this.createMatch(currentUserId, likedUserId);
                }

                // Wait for animation to finish, then reset the card
                setTimeout(() => {
                    this.users.splice(this.currentCardIndex, 1);
                    this.resetCard();
                }, 300); // Ensure the transition happens before removing the card
            }
        },

        async createMatch(userId, likedUserId) {
            const CREATE_MATCH = gql`
                mutation CreateMatch($input: CreateMatchInput!) {
                    createMatch(input: $input) {
                        match {
                            id
                            userId
                            likedUserId
                            createdAt
                            updatedAt
                        }
                    }
                }
            `;
            try {
                const { data } = await this.$apollo.mutate({
                    mutation: CREATE_MATCH,
                    variables: {
                        input: {
                            userId: userId,
                            likedUserId: likedUserId,
                        },
                    },
                });

                console.log("Match created:", data);
                EventBus.$emit('message', {
                    type: 'success',
                    text: `Like Success!`,
                });
            } catch (error) {
                console.error("Error creating match:", error);
                EventBus.$emit('message', {
                    type: 'error',
                    text: "You already liked this user.",
                });
            }
        },

        resetCard() {
            const currentCard = this.$refs.userCards[this.currentCardIndex];
            const heartIcon = this.$el.querySelector('.action-heart');
            const xIcon = this.$el.querySelector('.action-x');

            if (currentCard) {
                currentCard.style.transition = '';
                currentCard.style.transform = 'translateX(0px) rotate(0deg)';
            }

            // Reset icon colors
            if (heartIcon) heartIcon.style.color = 'black';
            if (xIcon) xIcon.style.color = 'black';
            // Reset the state for the current card and cleanup event listeners
            this.currentCardIndex = null;

            // Remove event listeners after swipe interaction
            document.removeEventListener('mousemove', this.swipeCard);
            document.removeEventListener('mouseup', this.endSwipe);
            document.removeEventListener('touchmove', this.swipeCard);
            document.removeEventListener('touchend', this.endSwipe);
        },
    },
};
