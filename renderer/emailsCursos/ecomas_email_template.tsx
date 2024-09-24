import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EcomasEmailTemplateProps {
  name?: string;
  message?: string;
  curso?: string;
}

export const EcomasEmailTemplate = ({
  name,
  message,
  curso = "{Curso Ecomas}",
}: EcomasEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>{curso}</Preview>
    <Body style={main}>
      <Container style={{...container, borderRadius: "10px"}}>
        <Section style={logoContainer}>
          <Img
            src='https://ecomas.pe/_next/image?url=%2Fimage%2Fecomas.png&w=256&q=75'
            width="200"
            height="50"
            alt="ecomas"
          />
        </Section>
        <Heading style={h1}>Saludos cordiales, {name}</Heading>
        <Text style={heroText}>
          Nos complace otorgarte este certificado de finalización del curso de
          <strong> {curso} </strong> 
           de Ecomás.
          ¡Felicidades de parte de todo el equipo de Ecomás!
        </Text>

        <Text style={text}>
          También, adjuntamos los enlaces de los <strong>materiales</strong> utilizados en el curso:
        </Text>
        <pre style={text}>{message}</pre> {/* Cambio aquí */}

        <Section>
          <Row style={footerLogos}>
            <Column style={{ width: "66%" }}>
              <Row>
                <Column style={{ width: "64px" }}>
                  <Img
                    src='https://lh3.googleusercontent.com/a/ACg8ocL4L1j3JlZEDlqvz_jV7OSxSd0cH43VioCYBrDWqYwwhvlS6HSs=s346-c-no'
                    width="64"
                    height="64"
                    alt="ecomas"
                    style={productIcon}
                  />
                </Column>
                <Column style={{ paddingLeft: "18px" }}>
                  <Text style={productTitle}>ECOMÁS Consultoría y Capacitación</Text>
                  <Text style={productDescription}>Imagen institucional, Área de certificación - ECOMÁS</Text>
                </Column>
              </Row>
            </Column>
            <Column>
              <Section>
                <Row>
                  <Column>
                    <Link href="https://api.whatsapp.com/send/?phone=51921818181&text&type=phone_number&app_absent=0">
                      <Img
                        src='https://cdn-icons-png.flaticon.com/128/5968/5968841.png'
                        height="32"
                        alt="ecomas"
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link  href="https://web.facebook.com/ecomascyc">
                      <Img
                        src='https://cdn-icons-png.flaticon.com/128/5968/5968764.png'
                        height="28"
                        alt="ecomas"
                      />                    
                      </Link>
                  </Column>
                  <Column>
                    <Link href="https://www.tiktok.com/@ecomas_cyc">
                      <Img
                        src='https://cdn-icons-png.flaticon.com/128/5968/5968809.png'
                        height="25"
                        alt="ecomas"
                      />                    
                      </Link>
                  </Column>
                </Row>
              </Section>
            </Column>
          </Row>
        </Section>

        <Section>
          <Link
            style={footerLink}
            href="https://ecomas.pe"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visítanos en ecomas.pe
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://api.whatsapp.com/send/?phone=51921818181&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            921818181
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}

            target="_blank"
            rel="noopener noreferrer"
          >
            Jr, Lambayeque N° 1014, Juliaca 21001
          </Link>

          <Text style={footerText}>
            El contenido de este correo electrónico es confidencial y está destinado
            exclusivamente a los participantes de los diplomados y/o cursos ofrecidos
            por ECOMÁS Consultoría y Capacitación. Queda estrictamente prohibido compartir
            cualquier parte de este mensaje con terceros sin el consentimiento por escrito
            de ECOMÁS Consultoría y Capacitación. En caso de haber recibido este mensaje
            por error, le solicitamos que responda a este correo y proceda a su eliminación.
            Agradecemos su cooperación y comprensión en este asunto. <br />

            <br />
            Todos los derechos reservados.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

EcomasEmailTemplate.PreviewProps = {
  name: "Juan",
  message: "MATERIALES: \n• SESIÓN 01: https://www.google.com , https://www.google.com \n• SESIÓN 02: https://www.google.com \n• SESIÓN 03: https://www.google.com \nVIDEOS: \n• SESIÓN I : https://n9.cl/mh1vqf \n• SESIÓN II : https://n9.cl/yfio81 \n• SESIÓN III: https://n9.cl/i11cq \n• SESIÓN IV : https://n9.cl/lbuwli",
} as EcomasEmailTemplateProps;

export default EcomasEmailTemplate;

const footerText = {
  fontSize: "12px",
  color: "#b7b7b7",
  lineHeight: "15px",
  textAlign: "justify" as const,
  marginBottom: "50px",
};

const footerLink = {
  color: "#b7b7b7",
  textDecoration: "underline",
};

const footerLogos = {
  marginBottom: "32px",
  paddingLeft: "8px",
  paddingRight: "8px",
  width: "100%",
};

const main = {
  backgroundColor: "#0274c3",
  margin: "0 auto",
  padding: "10px 10px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "#fff",
  padding: "0px 20px",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "25px",
  fontWeight: "700",
  margin: "20px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "15px",
  lineHeight: "28px",
  marginBottom: "10px",
  textAlign: "justify" as const,
  verticalAlign: "middle",

};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productIcon = {
  margin: "0 0 0 0px",
  borderRadius: "14px",
  border: "1px solid rgba(128,128,128,0.2)",
};

const productTitle = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",

  fontSize: "12px",
  fontWeight: "600", ...resetText
};

const productDescription = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  ...resetText,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",

};
