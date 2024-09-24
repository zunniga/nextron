import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text, Column, Row, } from "@react-email/components";
import * as React from "react";

interface SayanEmailTemplateProps {
  groupName?: string;
  dataString?: string[];
}

export const SayanTemplate = ({
  groupName,
  dataString,
}: SayanEmailTemplateProps) => {
  return (
    <Html>
      <Head />
        <Preview>Corporación Sayan</Preview>
          <Body style={main}>
            <Container style={container}>
              <Section style={coverSection}>
                <Section style={imageSection}>
                  <Img
                    src="https://i.postimg.cc/cLvDRJhN/LOGO-HORIZONTAL-COLOR.png"
                    width="230"
                    alt="Sayan"
                    style={{marginLeft: "20px"}}
                  />
                    </Section>
                    <Section style={upperSection}>
                      <Heading style={h1}>Estimado(a), {groupName}</Heading>
                        <Text style={{ ...mainText, display: "inline" }}>
                          Es un honor para nosotros otorgarle estos certificados de finalización
                          sobre los modulares correspondientes a su diplomado
                          en Corporación Sayan.<br/>
                          Agradecemos su
                          dedicación y compromiso por completar este programa educativo con éxito.
                        </Text>
                      <Section style={verificationSection}>
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
                    </Section>
                    <Hr />
                    <Section style={{...lowerSection}}>
                      <Row>
                        <Column align="center" style={{ width: "40%" }}>
                          <Img
                            src='https://i.postimg.cc/02WWKSpf/logo-sayan.png'
                            width="100%"
                            alt="Sayan"
                            style={productIcon}
                          />
                        </Column>
                        <Column align="left" style={{ paddingLeft: "18px", width: "60%" }}>
                          <Text style={productTitle}>Corporación Sayan</Text>
                          <Text style={productDescription}>Área de certificación</Text>
                          <Text style={productDescription}>
                            <strong>Teléfono:</strong> <Link href="https://api.whatsapp.com/send?phone=51978490739"> +51 978490739</Link>
                          </Text>
                          {/* <Text style={productDescription}>
                            <strong>Dirección:</strong> Jr, Lambayeque N° 1014, Juliaca 21001
                          </Text> */}
                          <Text style={productDescription}>
                            <strong>Correo:</strong> sayancorporacion@gmail.com
                          </Text>
                        <Link
                            href="https://sayan.edu.pe/"
                            style={productLink}
                            data-saferedirecturl="https://sayan.edu.pe/"
                        >
                            <strong style={{color: "#676766"}}>Sitio Web:</strong>  www.sayan.edu.pe
                        </Link>
                        <Text style={{ ...productDescription, marginBottom: "2px" }}>VISÍTANOS EN:</Text>
                        <Section style={iconContainer}>
                            <Row>
                              <Column style={{marginLeft: "0px"}}>
                                <Link href="https://web.facebook.com/corp.sayan?_rdc=1&_rdr">
                                  <Img
                                    src='https://i.postimg.cc/13c3m9xD/facenooksayan.png'
                                    height="32"
                                    alt="Sayan"
                                    style={{marginRight: "8px", marginTop: "10px"}}
                                  />
                                </Link>
                              </Column>
                              <Column>
                                <Link href="https://www.tiktok.com/@corporacion.sayan?_t=8kZ2uXltHyY&_r=1">
                                  <Img
                                    src='https://i.postimg.cc/1zm54LP2/tiktoksayan.png'
                                    height="32"
                                    alt="Sayan"
                                    style={{marginRight: "8px", marginTop: "10px"}}
                                  />
                                </Link>
                              </Column>
                              <Column>
                                <Link href="https://www.instagram.com/corporacion.sayan/">
                                  <Img
                                    src='https://i.postimg.cc/6QM6ZYp3/isntagramsayan.png'
                                    height="32"
                                    alt="Sayan"
                                    style={{ marginTop: "10px"}}
                                  />
                                </Link>
                              </Column>
                            </Row>
                          </Section>
                        </Column>
                      </Row>
                    </Section>
                </Section>
                <Text style={footerText}>
                  El contenido de este correo electrónico es confidencial y
                  está destinado exclusivamente a Corporación Sayan. Queda
                  estrictamente prohibida el compartimiento de cualquier parte
                  de este mensaje con terceros sin el consentimiento por escrito
                  por Corporación Sayan. En caso de recepción errónea, le
                  solicitamos responder a este correo y proceder a su eliminación.
                  Agradecemos su colaboración y comprensión en este asunto.
                </Text>
            </Container>
          </Body>
    </Html >
);
}

export default SayanTemplate;

const main = {
    backgroundColor: "#fff",
    color: "#212121",
};

const container = {
    padding: "15px",
    margin: "0 auto",
    backgroundColor: "#eee",

};

const iconContainer = {
    display: "flex",
};

const h1 = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
};

const text = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    margin: "24px 0",

};

const imageSection = {
    backgroundColor: "#cffafe",
    display: "flex",
    padding: "15px 0",
    alignItems: "center",
    justifyContent: "center",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 20px" };

const lowerSection = { padding: "20px 20px" };

const footerText = {
    ...text,
    fontSize: "12px",
    padding: "0 20px",
    textAlign: "justify" as const,
};

const verifyText = {
    ...text,
    margin: 0,
    fontWeight: "bold",
    textAlign: "center" as const,
};

const validityText = {
    ...text,
    margin: "0px",
    textAlign: "center" as const,
};

const verificationSection = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const mainText = { ...text, marginBottom: "14px" };

const resetText = {
    margin: "0",
    padding: "0",
    lineHeight: 1.4,
};

const productIcon = {
    padding: "0 0 0 0px",
    maxWidth: "100%",
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

const productLink = {
    fontSize: "12px",
    color: "rgb(0,112,201)",
    textDecoration: "none",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",

};
