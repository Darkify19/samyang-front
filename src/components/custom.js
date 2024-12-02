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
            if (currentCard) {
                // Apply the swipe effect
                currentCard.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 20}deg)`;

                // Dynamically change box-shadow based on swipe direction
                this.cardBoxShadow = deltaX > 0
                    ? '0 6px 55px rgba(0, 255, 0, 0.5)'
                    : '0 6px 55px rgba(255, 0, 0, 0.5)';
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

            // Clean up event listeners after swipe ends
            this.resetCard();
        },

        async handleSwipe(direction) {
            if (this.currentCardIndex === null) return;

            const currentCard = this.$refs.userCards[this.currentCardIndex];
            const likedUserId = this.users[this.currentCardIndex].id; // Liked user's ID
            const currentUserId = this.$store.getters.getUser.id; // Get the current user's ID from Vuex

            if (currentCard) {
                currentCard.style.transition = 'transform 0.3s ease';
                currentCard.style.transform = `translateX(${direction === 'right' ? 500 : -500}px) rotate(${direction === 'right' ? 30 : -30}deg)`;

                // Clone the user object to make it mutable
                const user = { ...this.users[this.currentCardIndex] };
                user.isRemoved = true;  // Mark as removed in the cloned object

                // Update the user in the array
                this.$set(this.users, this.currentCardIndex, user);

                // Trigger the appropriate mutation based on the swipe direction
                if (direction === 'right') {
                    // Like (Right Swipe) - Create Match
                    await this.createMatch(currentUserId, likedUserId);
                } else {
                    // Dislike (Left Swipe) - Skip User
                    await this.skipUser(currentUserId, likedUserId);
                }

                // Remove the user from the list and reset the card
                setTimeout(() => {
                    this.users.splice(this.currentCardIndex, 1); // Remove user from the array
                    this.resetCard();
                }, 300);
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
                            userId: userId,         // Current user ID
                            likedUserId: likedUserId, // Liked user's ID
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

        async skipUser(userId, likedUserId) {
            const SKIP_USER = gql`
                mutation SkipUser($userId: ID!, $likedUserId: ID!) {
                    skipUser(userId: $userId, likedUserId: $likedUserId) {
                        match {
                            id
                            userId
                            likedUserId
                            createdAt
                            updatedAt
                        }
                        errors
                    }
                }
            `;

            try {
                const { data } = await this.$apollo.mutate({
                    mutation: SKIP_USER,
                    variables: { userId: userId, likedUserId: likedUserId },
                });

                console.log("User skipped:", data);
                EventBus.$emit('message', { type: 'success', text: "User skipped successfully!" });

                // Move the skipped user to the bottom of the list
                this.users.push(this.users[this.currentCardIndex]); // Re-add to the bottom of the array
            } catch (error) {
                console.error("Error skipping user:", error);
                EventBus.$emit('message', { type: 'error', text: "Error skipping user." });
            }
        },

        resetCard() {
            const currentCard = this.$refs.userCards[this.currentCardIndex];
            if (currentCard) {
                currentCard.style.transition = '';
                currentCard.style.transform = 'translateX(0px) rotate(0deg)';
            }

            this.currentCardIndex = null;
            // Remove event listeners after swipe interaction
            document.removeEventListener('mousemove', this.swipeCard);
            document.removeEventListener('mouseup', this.endSwipe);
            document.removeEventListener('touchmove', this.swipeCard);
            document.removeEventListener('touchend', this.endSwipe);
        },
    },
};
