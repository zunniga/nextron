import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Row,
  Column,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PromasEmailTemplate {
  groupName?: string;
  dataString?: string[];
}

export const PromasTemplate = ({
  groupName,
  dataString,
}: PromasEmailTemplate) => (
  <Html>
    <Head />
    <Preview>Corporación Promás</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src='https://www.promas.edu.pe/_next/image?url=%2Flogos%2Flogo_book.png&w=1920&q=75'
          width="500"

          alt="Promas Logo"
          style={{
            margin: "auto",
            width: "50%",
            marginBottom: "0px",
            marginTop: "20px"
          }}
        />
        <Heading style={h1}>Estimado(a) {groupName}</Heading>

        <Text style={{ ...text, marginBottom: "2px", textAlign: "justify" as const, }}>
          Es un placer para nosotros otorgarle estos certificados de finalización
          de los modulares correspondientes a su diplomado en Corporación Promas.
          <br/>
          Reconocemos tu
          dedicación y esfuerzo para completar con éxito este programa educativo.
          Adjuntamos los certificados correspondientes:
        </Text>
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
        <Section style={informationTable}>
          <Row style={informationTableRow}>
            <Column colSpan={2}>
              <Section>
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>CORREO:</Text>
                    <Link
                      style={{
                        ...informationTableValue,
                        color: "#15c",
                        textDecoration: "underline",
                      }}
                    >
                      promascorporacion@gmail.com
                    </Link>
                  </Column>
                </Row>

                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>TELÉFONO</Text>
                    <Text style={informationTableValue}>+51 984 040 264</Text>
                  </Column>
                </Row>

                {/* <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>DIRECCIÓN</Text>
                    Jr, Lambayeque N° 1014, Juliaca 21001
                  </Column>
                </Row> */}
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>SITIO WEB</Text>
                    www.promas.edu.pe
                  </Column>
                </Row>
              </Section>
            </Column>
            <Column style={informationTableColumn} colSpan={2}>
              <Text style={{ ...informationTableLabel, marginBottom: "20px" }}>VISÍTANOS EN:</Text>
              <Section style={{ display: "flex" }}>
                <Row>
                  <Column >
                    <Link href="https://web.facebook.com/people/Corporaci%C3%B3n-Prom%C3%A1s/61552473052389/?_rdc=1&_rdr">
                      <Img
                        src='https://i.postimg.cc/fb61tdQF/faceboko.png'
                        height="24"
                        alt="promas"
                        style={{ marginRight: "7px" }}
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href="https://www.tiktok.com/@promas.corp">
                      <Img
                        src='https://i.postimg.cc/QdY2DP4j/tiktok.png'
                        height="24"
                        alt="promas"
                        style={{ marginRight: "7px" }}
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href="https://www.instagram.com/corporacion.promas/">
                      <Img
                        src='https://i.postimg.cc/HkkqfHtS/instagram.png'
                        height="24"
                        alt="promas"
                        style={{ marginRight: "7px" }}
                      />
                    </Link>
                  </Column>
                </Row>
              </Section>
            </Column>
          </Row>
        </Section>
        <Text style={footerText}>
          El contenido de este correo electrónico es confidencial y está destinado
          exclusivamente a Corporación Promás. Queda estrictamente prohibida el
          compartimiento de cualquier parte de este mensaje con terceros sin el
          consentimiento por escrito por Corporación PROMÁS. En caso de recepción
          errónea, le solicitamos responder a este correo y proceder a su eliminación.
          Agradecemos su colaboración y comprensión en este asunto.
        </Text>

      </Container>
    </Body>
  </Html>
);

export default PromasTemplate;

const footerText = {
  fontSize: "12px",
  color: "#b7b7b7",
  lineHeight: "15px",
  textAlign: "justify" as const,
  marginBottom: "50px",
};

const main = {
  backgroundColor: "#fdf4ff",
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
  margin: "20px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",

  fontFamily:
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",

};


const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};




const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "12px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",

};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

