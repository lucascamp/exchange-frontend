import { defineStore } from "pinia";

export const useApiStore = defineStore('apiStore', {
    state: () => {
        return {
            userId: null,
            name: null, 
            email: null,
            message: null,
            token: null,
            coinData: {}
        }
    },
    actions: {
        //get list of coins
        async getCoins() {
            if(localStorage.getItem("token")) {
                const res = await fetch('api/coin', {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

                this.coinData = await res.json()
            }
        },

        //exchange coins
        async exchangeCoins(amount, newCoin) {
            if (localStorage.getItem("token") && amount && newCoin) {
            try {
                const res = await fetch(`api/exchange/${newCoin}`, {
                method: "POST",
                body: JSON.stringify({ amount }),
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                });
        
                if (!res.ok) throw new Error("Fail to get API data");
        
                this.convertedCoinData = await res.json();
                return this.convertedCoinData;
            } catch (error) {
                throw error;
            }
            } else {
                throw new Error("Parameters error or missing token");
            }
        },

        //list user transactions
        async listAllExchangesByUser() {
            if (localStorage.getItem("token")) {
            try {
                const res = await fetch(`api/listTransactions`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                });
        
                if (!res.ok) throw new Error("Fail to get API data");
        
                this.convertedListData = await res.json();
                return this.convertedListData;
            } catch (error) {
                throw error;
            }
            } else {
                throw new Error("Parameters error or missing token");
            }
        },

        //login
        async login(apiRoute, formData) {
            const res = await fetch(`api/${apiRoute}`, {
                method: "post",
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if(data.status) {
                localStorage.setItem('name', data.user.name)
                localStorage.setItem('token', data.token)
                localStorage.setItem('userId', data.user.id)
                this.name = data.user.name
                this.router.push({name: 'coins'})
            } else {
                this.message = data.message;
            }
        },

        // logout
        async logout() {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
        
            if (!userId || !token) {
                throw new Error("Token or UserId undefined");
            }
        
            try {
                const res = await fetch(`api/logout/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
        
                if (!res.ok) throw new Error("Fail to logout.");
        
                localStorage.removeItem('token');
                localStorage.removeItem('name');
                localStorage.removeItem('userId');
        
                return true;
        
            } catch (error) {
                console.error("Error in logout:", error);
                throw error;
            }
        }
    }
})