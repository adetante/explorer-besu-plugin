import * as React from "react";
import { observable, action } from "mobx";
import { AuthStore } from "../AuthStore";

export class AuthState {
    private username: string;
    private password: string;

    @observable error = false;
    @observable isLoading = false;

    constructor(
        private authStore: AuthStore,
        private onLoginSuccess: () => void
    ) {}

    handleUsernameChanged = (ev: React.FormEvent<HTMLInputElement>) => {
        const value = (ev.target as HTMLInputElement).value;
        this.username = value;
    }

    handlePasswordChanged = (ev: React.FormEvent<HTMLInputElement>) => {
        const value = (ev.target as HTMLInputElement).value;
        this.password = value;
    }

    @action
    login = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        this.error = false;
        this.isLoading = true;
        this.authStore
            .authenticate({ username: this.username, password: this.password })
            .then((success) => {
                this.error = !success;
                this.isLoading = false;
                if (success) {
                    this.onLoginSuccess();
                }
            })
            .catch(() => {
                this.error = true;
                this.isLoading = false;
            });
    }
}
