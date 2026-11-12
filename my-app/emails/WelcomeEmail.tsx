import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
} from "@react-email/components";

type WelcomeEmailProps = {
  name: string;
};

export default function WelcomeEmail({
  name,
}: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />

      <Preview>Welcome to our platform!</Preview>

      <Body style={{ backgroundColor: "#f6f9fc" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            padding: "30px",
            borderRadius: "8px",
          }}
        >
          <Heading style={{ color: "#2563eb" }}>
            Welcome, {name}!
          </Heading>

          <Text>
            Thank you for joining our platform.
            We're excited to have you here.
          </Text>

          <Hr />

          <Text>
            You can now explore all the features
            available on our platform.
          </Text>

          <Button
            href="https://example.com"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "6px",
            }}
          >
            Visit Platform
          </Button>

          <Text style={{ color: "#888888", fontSize: "12px" }}>
            This is an automated email. Please do not reply.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}