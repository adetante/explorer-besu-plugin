import * as React from "react";
import * as ReactDOM from "react-dom";
import { observer } from "mobx-react";
import { createPalette } from "@alethio/ui/lib/theme/createPalette";
import { createTheme } from "@alethio/ui/lib/theme/createTheme";
import { ThemeProvider, default as styled } from "styled-components";
import { Form, IFormProps } from "@alethio/ui/lib/form/Form";
import { FormStatus } from "@alethio/ui/lib/form/FormStatus";
import { FormItem } from "@alethio/ui/lib/form/FormItem";
import { InputField } from "@alethio/ui/lib/form/field/InputField";
import { Label } from "@alethio/ui/lib/form/Label";
import { SubmitButton } from "@alethio/ui/lib/form/SubmitButton";
import { AuthStore } from "../AuthStore";

enum LoginFormField {
    Username = "username",
    Password = "password"
}

interface ILoginFormValues {
    [LoginFormField.Username]: string;
    [LoginFormField.Password]: string;
  }

const LoginRoot = styled.div`
    min-width: 490px;
    max-width: 100%;
    min-height: 200px;
    border: 1px solid ${({ theme }) => theme.colors.messageBoxPrimaryBorder};
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.04);
    box-sizing: border-box;
    padding: 48px;
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

export interface IAuthProps {
    authStore: AuthStore;
    onLoginSuccess(): void;
}

@observer
export class Auth extends React.Component<IAuthProps> {
    render() {
        return (
            <LoginRoot>
                <Text>
                    This web3 provider requires authentication.<br/>
                    Please enter your login/password and validate.
                </Text>
                <Form<ILoginFormValues>
                    initialValues={{
                        [LoginFormField.Username]: "",
                        [LoginFormField.Password]: ""
                    }}
                    onSubmit={this.onSubmit}
                >
                    <FormItem>
                        <Label>Username</Label>
                        <InputField
                            type="text"
                            id={LoginFormField.Username}
                            name={LoginFormField.Username}
                            required
                            validate={this.validateRequired}
                            placeholder="Username"
                        />
                    </FormItem>
                    <FormItem>
                        <Label>Password</Label>
                        <InputField
                            type="password"
                            id={LoginFormField.Password}
                            name={LoginFormField.Password}
                            required
                            validate={this.validateRequired}
                            placeholder="Password"
                        />
                    </FormItem>
                    <FormStatus />
                    <SubmitButton>
                       Authenticate
                    </SubmitButton>
                </Form>
            </LoginRoot>
        );
    }

    onSubmit: IFormProps<ILoginFormValues>["onSubmit"] = async ({ username, password }, actions) => {
        return this.props.authStore
            .authenticate({ username, password })
            .then((success) => {
                if (!success) {
                    actions.setStatus({
                        success: false,
                        message: "Error occured, please verify your credentials"
                    });
                } else {
                    this.props.onLoginSuccess();
                }
            })
            .catch(() => {
                actions.setStatus({
                    success: false,
                    message: "Error occured, please verify your credentials"
                });
            });
    }

    validateRequired(value: string) {
        if (!value) {
            return "Required";
        }
        return undefined;
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
