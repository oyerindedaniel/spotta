import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  render,
  Text,
} from "@react-email/components";

import { BASE_URL } from "../src/config";

interface SpottaForgotPasswordEmailProps {
  codePin: string;
}

const baseUrl = BASE_URL;
export const SpottaForgotPasswordEmailTemplate = (
  props: SpottaForgotPasswordEmailProps,
) => render(<SpottaForgotPasswordEmail {...props} />);

export const SpottaForgotPasswordEmail = ({
  codePin,
}: SpottaForgotPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Spotta Forgot Password Verification Email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Spotta Forgot Password Verification Email</Heading>
        <Text style={{ ...text, marginBottom: "14px" }}>
          Copy and paste this code:
        </Text>
        <code style={code}>{codePin}</code>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          If you didn&apos;t send this email, you can safely ignore it.
        </Text>
      </Container>
    </Body>
  </Html>
);

SpottaForgotPasswordEmail.PreviewProps = {
  codePin: "sparo-ndigo-amurt-secan",
} as SpottaForgotPasswordEmailProps;

export default SpottaForgotPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
