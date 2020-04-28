import * as React from "react";
import * as ReactDOM from "react-dom";
import { observer } from "mobx-react";
import { createPalette } from "@alethio/ui/lib/theme/createPalette";
import { createTheme } from "@alethio/ui/lib/theme/createTheme";
import { ThemeProvider } from "styled-components";
import styled from "@alethio/explorer-ui/lib/styled-components";
import { AuthStore } from "../AuthStore";
import { AuthState } from "./AuthState";

const LoginRoot = styled.div`
    min-width: 490px;
    max-width: 100%;
    min-height: 220px;
    border: 1px solid ${({ theme }) => theme.colors.messageBoxPrimaryBorder};
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.04);
    box-sizing: border-box;
    padding: 48px;
    text-align: center;
    z-index: 99;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%,-50%);
    background-color: ${({ theme }) => theme.colors.messageBoxPrimaryBg};
`;

const Text = styled.div`
    font-size: 16px;
    line-height: 20px;
    color: ${({ theme }) => theme.colors.messageBoxPrimaryText};
`;

const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.error};
    min-height: 20px;
    margin-top: 20px;
`;

const Input = styled.input`
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 10px;
    ::placeholder {
        color: ${({ theme }) => theme.colors.messageBoxPrimaryText};
    }
`;

const Button = styled.input`
    display: block;
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: ${({ theme }) => theme.colors.buttonPrimaryBg};
    color: ${({ theme }) => theme.colors.buttonPrimaryText};
    padding: 10px;
    border: none;
`;

const LoginForm = styled.form`
    margin-top: 20px;
`;

export interface IAuthProps {
    authStore: AuthStore;
    onLoginSuccess(): void;
}

@observer
export class Auth extends React.Component<IAuthProps> {
    private authState: AuthState;

    constructor(props: any) {
        super(props);
        this.authState = new AuthState(this.props.authStore, this.props.onLoginSuccess);
    }
    render() {
        return (
            <LoginRoot>
                <Text>
                    This web3 provider requires authentication.<br/>
                    Please enter your login/password and validate.
                </Text>
                <LoginForm onSubmit={this.authState.login}>
                    <Input
                        type="text"
                        required
                        placeholder="Username"
                        onChange={this.authState.handleUsernameChanged}
                    />
                    <Input
                        type="password"
                        required
                        placeholder="Password"
                        onChange={this.authState.handlePasswordChanged}
                    />
                    <Button
                        type="submit"
                        disabled={this.authState.isLoading}
                        value={this.authState.isLoading ? "Loading..." : "Authenticate"}
                    />
                </LoginForm>
                <ErrorMessage>
                    { this.authState.error
                        ? "An error occured: please verify your credentials"
                        : "" }
                </ErrorMessage>
            </LoginRoot>
        );
    }
}

export const renderLoginForm = (authStore: AuthStore) => {
    const rootElt = document.createElement("div");
    document.body.appendChild(rootElt);
    const theme = createTheme(createPalette());

    ReactDOM.render(
        <ThemeProvider theme={theme}>
            <Auth
                authStore={authStore}
                onLoginSuccess={() => {
                    ReactDOM.unmountComponentAtNode(rootElt);
                    document.body.removeChild(rootElt);
                }}
            />
        </ThemeProvider>,
        rootElt
    );
};
