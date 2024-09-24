import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Row,
  } from "@react-email/components";
  import * as React from "react";
  
  interface RizoEmailTemplateProps {
    name?: string;
    message?: string;
    curso?: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";
  
  export const RizoEmailTemplate = ({
    name,
    message,
    curso = 'Curso Rizo',
  }: RizoEmailTemplateProps) => (
    <Html>
      <Head />
      <Preview>{curso}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Row>
              <Column style={headerContent}>
                <Heading style={headerContentTitle}>
                  Certificado de curso
                </Heading>
                <Text style={headerContentSubtitle}>
                Adjuntamos tu Certificado y Materiales del Curso de <strong>{curso}</strong>
                </Text>
              </Column>
              <Column style={headerImageContainer}>
                <Img
                  style={{...headerImage}}
                  width={320}
                  src='https://rizo.edu.pe/_next/image?url=%2Flogo%2Flogo-navbar-3.png&w=828&q=75'
                />
              </Column>
            </Row>
            <Row>
                        <Column align="right" style={{ width: "33%", paddingRight: "0px", paddingBottom: "10px" }}>
                            <Link href="https://web.facebook.com/corp.rizo">
                                <Img
                                    width={32}
                                    src="https://i.postimg.cc/DZvd6cYk/facebook.png"
                                />
                            </Link>
                        </Column>
                        <Column align="center" style={{ width: "10%", paddingLeft: "8px", paddingBottom: "10px" }}>
                            <Link href="https://www.tiktok.com/@corporacion.rizo">
                                <Img
                                    width={32}
                                    src="https://i.postimg.cc/j2nTFsqB/image.png"
                                />
                            </Link>
                        </Column>
                        <Column align="left" style={{ width: "33%", paddingLeft: "8px", paddingBottom: "10px" }}>
                            <Link href="https://www.instagram.com/corporacion.rizo/">
                                <Img
                                    width={32}
                                    src="https://i.postimg.cc/4nCGCrmy/image-1.png"
                                />
                            </Link>
                        </Column>
                    </Row>
          </Section>
  
          <Section style={content}>
            <Heading as="h2" style={title}>
              Hola, {name}
            </Heading>
            <Text style={paragraph}>
            ¡Felicidades por completar el curso de <strong>{curso}</strong> con éxito! 
            Adjunto a este correo encontrarás tu certificado oficial.
            </Text>
            <Text style={paragraph}>
            Además, hemos incluido los <strong>materiales y videos</strong> del curso para 
            que sigas profundizando en los temas tratados.
            </Text>
            <pre style={paragraph}>{message}</pre> {/* Cambio aquí */}
            <Hr style={divider} />
            <Section style={buttonContainer}>
              <Link style={button} href="https://rizo.edu.pe/">
                Ir a la página de Rizo
              </Link>
            </Section>
          </Section>
        </Container>
  
        <Section style={footer}>
          <Text style={footerText}>
          Este correo electrónico es confidencial y está destinado únicamente 
          para el destinatario. Si has recibido este correo por error, 
          por favor notifícanos inmediatamente y elimínalo.
          </Text>

          <Link style={footerLink}>
          capacitaciones@rizo.edu.pe
          </Link>
          <Link href="https://api.whatsapp.com/send/?phone=51961646248&text=Hola%2C+deseo+realizar+una+consulta...&type=phone_number&app_absent=0" style={footerLink}>
            Contáctanos: 961646248
          </Link>
          <Link href="https://rizo.edu.pe/" style={footerLink}>
            rizo.edu.pe
          </Link>
  
          <Hr style={{...footerDivider, marginBottom: "10px"}} />
  
          <Img  width={32} src='https://i.postimg.cc/MH93zf6v/ICONO.png' />
          <Text style={footerAddress}>
            <strong>Corporación Rizo</strong>, Jr, Lambayeque N° 1014, Juliaca 21001, San Román, Juliaca
          </Text>
          <Text style={footerHeart}>{"<3"}</Text>
        </Section>
      </Body>
    </Html>
  );
  
  RizoEmailTemplate.PreviewProps = {
    name: "Juan",
    message: [
        "MATERIALES:",
        "SESION I  : https://n9.cl/s97lk",
        "SESION II : https://n9.cl/a9v7k",
        "https://n9.cl/2zs6v",
        "SESION III: https://n9.cl/67vd0",
        "VIDEOS:",
        "SESION I  : https://n9.cl/a106h",
        "SESION II : https://n9.cl/u7cos2",
        "SESION III: https://n9.cl/6q57q"
      ].join("\n"),
    curso: "Mecánica de suelos",
  } as RizoEmailTemplateProps;
  
  export default RizoEmailTemplate;
  
  const main = {
    backgroundColor: "#f3f3f5",
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  };
  
  const headerContent = { padding: "20px 10px 15px 20px" };
  
  const headerContentTitle = {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    lineHeight: "27px",
  };
  
  const headerContentSubtitle = {
    color: "#fff",
    fontSize: "14px",
  };
  
  const headerImageContainer = {
    padding: "30px 10px 30px 0px",
  };
  
  const headerImage = {
    maxWidth: "100%",
  };
  
  const title = {
    margin: "0 0 15px",
    fontWeight: "bold",
    fontSize: "21px",
    lineHeight: "21px",
    color: "#0c0d0e",
  };
  
  const paragraph = {
    fontSize: "15px",
    lineHeight: "21px",
    color: "#3c3f44",
  };
  
  const divider = {
    margin: "30px 0",
  };
  
  const container = {
    width: "680px",
    maxWidth: "100%",
    margin: "0 auto",
    backgroundColor: "#ffffff",
  };
  
  const footer = {
    width: "680px",
    maxWidth: "100%",
    margin: "32px auto 0 auto",
    padding: "0 30px",
  };
  
  const content = {
    padding: "30px 30px 40px 30px",
  };
  
  const header = {
    borderRadius: "5px 5px 0 0",
    display: "flex",
    flexDireciont: "column",
    backgroundColor: "#20014f",
  };
  
  const buttonContainer = {
    marginTop: "24px",
    display: "block",
  };
  
  const button = {
    backgroundColor: "#20014f",
    fontSize: "17px",
    lineHeight: "17px",
    padding: "13px 17px",
    borderRadius: "4px",
    maxWidth: "120px",
    color: "#fff",
  };
  
  const footerDivider = {
    ...divider,
    borderColor: "#d6d8db",
  };
  
  const footerText = {
    fontSize: "12px",
    lineHeight: "15px",
    color: "#9199a1",
    margin: "0",
  };
  
  const footerLink = {
    display: "inline-block",
    color: "#9199a1",
    textDecoration: "underline",
    fontSize: "12px",
    marginRight: "10px",
    marginBottom: "0",
    marginTop: "8px",
  };
  
  const footerAddress = {
    margin: "4px 0",
    fontSize: "12px",
    lineHeight: "15px",
    color: "#9199a1",
  };
  
  const footerHeart = {
    borderRadius: "1px",
    border: "1px solid #d6d9dc",
    padding: "4px 6px 3px 6px",
    fontSize: "11px",
    lineHeight: "11px",
    fontFamily: "Consolas,monospace",
    color: "#e06c77",
    maxWidth: "min-content",
    margin: "0 0 32px 0",
  };
  