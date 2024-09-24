import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface CimadeEmailTemplateProps {
  groupName?: string;
  dataString?: string[];
}

export const CimadeEmailTemplate = ({
  groupName,
  dataString,
}: CimadeEmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>CIMADE Educación Continua</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Row>
              <Column>
                <Img
                  style={sectionLogo}
                  src="https://i.postimg.cc/pT8CYQTN/logo-cimade.png"
                  width="155"
                  alt="Cimade Logo"
                />
              </Column>
            </Row>
          </Section>

          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text style={heading}>Estimado(a) {groupName},</Text>
            <Text style={paragraph}>
              Adjunto encontrará sus certificados completos de los modulares
              correspondiente al diplomado que cursó con mucho éxito.
            </Text>
            <Text style={{ ...paragraph, marginBottom: "0px" }}>
              ¡Felicidades por este logro!
            </Text>
          </Section>

          <Section style={paragraphContent}>
            <br />
            <strong>
              {dataString &&
                dataString.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {index !== dataString.length - 1 && <br />}{" "}
                    {/* Agrega un salto de línea si no es el último elemento */}
                  </React.Fragment>
                ))}
            </strong>
            <br />
          </Section>

          <Section style={paragraphContent}>
            <Text style={{ ...paragraph, marginTop: "0px" }}>
              Muchas gracias,
            </Text>
            <Text style={{ ...paragraph, fontSize: "20px" }}>
              Equipo de CIMADE
            </Text>
          </Section>

          <Section style={containerContact}>
            <Row>
              <Column>
                <Row>
                  <Column style={{ width: "16px" }}>
                    <Img
                      src="https://i.postimg.cc/4NyFBnd3/envelope-solid.png"
                      width="16px"
                      style={{ paddingRight: "14px" }}
                    />
                  </Column>
                  <Column>
                    <Text style={{ ...menutext, marginBottom: "0" }}>
                      cimade.educacion@gmail.com
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column style={{ width: "16px" }}>
                    <Img
                      src="https://i.postimg.cc/Dwbp3D1k/phone-solid.png"
                      width="16px"
                      style={{ paddingRight: "14px" }}
                    />
                  </Column>
                  <Column>
                    <Text style={{ ...menutext, marginBottom: "0" }}>
                      +51 900102090
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column style={{ width: "16px" }}>
                    <Img
                      src="https://i.postimg.cc/R05sSRT3/location-dot-solid.png"
                      width="16px"
                      style={{ paddingRight: "14px" }}
                    />
                  </Column>
                  <Column>
                    {/* <Text style={{ ...menutext, marginBottom: "0" }}>
                      Jr, Lambayeque N° 1014, Juliaca 21001
                    </Text> */}
                  </Column>
                </Row>
                <Row>
                  <Column style={{ width: "16px" }}>
                    <Img
                      src="https://i.postimg.cc/15d7TPnr/globe-solid.png"
                      width="16px"
                      style={{ paddingRight: "14px" }}
                    />
                  </Column>
                  <Column>
                    <Text style={{ ...menutext, marginBottom: "0" }}>
                      www.cimade.edu.pe
                    </Text>
                  </Column>
                </Row>
              </Column>
            </Row>
            <Row>
              <Text style={paragraph}>Búscanos en nuestras redes:</Text>
            </Row>
            <Row
              align="left"
              style={{
                width: "84px",
                float: "left",
              }}
            >
              <Column style={{ paddingRight: "8px" }}>
                <Link href="https://web.facebook.com/CimadeEC?_rdc=1&_rdr">
                  <Img
                    width="20"
                    height="25"
                    src="https://i.postimg.cc/vTbBvWhc/facebook-f.png"
                  />
                </Link>
              </Column>
              <Column style={{ paddingRight: "8px" }}>
                <Link href="https://www.instagram.com/cimade_ec/">
                  <Img
                    width="28"
                    height="28"
                    src="https://i.postimg.cc/59Sj2R9v/instagram.png"
                  />
                </Link>
              </Column>
              <Column style={{ paddingRight: "8px" }}>
                <Link href="https://www.tiktok.com/@consorciocimade?lang=es">
                  <Img
                    width="24"
                    height="25"
                    src="https://i.postimg.cc/8c4CXjXw/tiktok.png"
                  />
                </Link>
              </Column>
            </Row>
          </Section>
          <Row>
            <Img
              style={footer}
              width="540"
              height="48"
              src="https://i.postimg.cc/dtJJ124x/title-label-header-label-3d-illustration.jpg"
            />
          </Row>
          <Section style={{ ...paragraphContent, paddingBottom: 30 }}>
            <Text
              style={{
                ...paragraph,
                fontSize: "12px",
                textAlign: "center",
                margin: 0,
              }}
            >
              El contenido de este correo electrónico es confidencial y está
              destinado exclusivamente a los participantes de los diplomados y/o
              cursos ofrecidos por CIMADE Educación Continua. Queda
              estrictamente prohibido compartir cualquier parte de este mensaje
              con terceros sin el consentimiento por escrito de CIMADE Educación Continua. En caso de
              haber recibido este mensaje por error, le solicitamos que responda
              a este correo y proceda a su eliminación. Agradecemos su
              cooperación y comprensión en este asunto.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
export default CimadeEmailTemplate;

const main = {
  backgroundColor: "#dbddde",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const sectionLogo = {
  padding: "20px 0px 0px 40px",
};

const menutext = {
  fontSize: "13.5px",
  marginTop: 0,
  fontWeight: 500,
  color: "#000",
};

const container = {
  margin: "30px auto",
  backgroundColor: "#fff",
  borderRadius: 5,
  overflow: "hidden",
};

const containerContact = {
  backgroundColor: "#f0fcff",
  width: "90%",
  borderRadius: "5px",
  overflow: "hidden",
  padding: "20px",
};

const heading = {
  fontSize: "20px",
  lineHeight: "26px",
  fontWeight: "700",
  color: "#006fae",
};

const paragraphContent = {
  padding: "0 40px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#3c4043",
};

const hr = {
  borderColor: "#e8eaed",
  margin: "20px 0",
};

const footer = {
  maxWidth: "100%",
  margin: "0",
};
