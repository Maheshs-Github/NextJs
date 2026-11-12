import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Preview,
  Section,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            margin: "40px auto",
            borderRadius: "8px",
          }}
        >
          <Heading style={{ color: "#1e293b", fontSize: "24px" }}>
            Welcome, {username}!
          </Heading>
          <Text style={{ color: "#334155", fontSize: "16px", lineHeight: "24px" }}>
            Thanks for registering. Please use the following 6-digit verification code to
            verify your account:
          </Text>
          <Section
            style={{
              padding: "16px",
              backgroundColor: "#f1f5f9",
              borderRadius: "6px",
              textAlign: "center",
              fontSize: "28px",
              fontWeight: "bold",
              letterSpacing: "6px",
              color: "#2563eb",
              margin: "20px 0",
            }}
          >
            {otp}
          </Section>
          <Text style={{ color: "#64748b", fontSize: "14px" }}>
            This verification code will expire in 1 hour. If you did not register for an account, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
