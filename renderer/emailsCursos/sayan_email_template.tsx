import {
    Body,
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
    Column,
    Row,
} from "@react-email/components";
import * as React from "react";

interface SayanEmailTemplateProps {
    name?: string;
    message?: string;
    curso?: string;
}

export default function SayanEmailTemplate({
    name,
    message,
    curso = '{CursoSayan}',
}: SayanEmailTemplateProps) {
    return (
        <Html>
            <Head />
            <Preview>Certificado del curso "Curso"</Preview>
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
                            <Heading style={h1}>Hola, {name}</Heading>
                            <Text style={{ ...mainText, display: "inline" }}>
                                Es un honor para nosotros otorgarte este certificado de finalización
                                del curso de
                                <Text style={{ ...mainText, fontWeight: 'bold', display: 'inline' }}> {curso} </Text>
                                <Text style={{ ...mainText, display: "inline" }}>
                                    de la empresa Sayan. Agradecemos tu
                                    dedicación y compromiso para completar este programa educativo con éxito.
                                </Text>
                            </Text>

                            <Section style={verificationSection}>
                                <Text style={verifyText}>MATERIALES DEL CURSO</Text>
                                <pre style={validityText}>{message}</pre> 
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
                                        <Text style={productTitle}>Sayan</Text>
                                        <Text style={productDescription}>Corporación</Text>
                                        <Text style={productDescription}>Área de certificación</Text>
                                        <Text style={productDescription}>
                                        <strong>Teléfono:</strong> <Link href="https://api.whatsapp.com/send?phone=51978490739"> +51 978490739</Link>
                                        </Text>
                                        <Text style={productDescription}>
                                        <strong>Dirección:</strong> Jr, Lambayeque N° 1014, Juliaca 21001
                                        </Text>
                                        <Text style={productDescription}>
                                        <strong>Correo:</strong> sayancorporacion@gmail.com
                                        </Text>
                                        <Link
                                            href="https://sayan.edu.pe/"
                                            style={productLink}
                                            data-saferedirecturl="https://sayan.edu.pe/"
                                        >
                                           <strong style={{color: "#676766"}}>Sitio Web:</strong>  sayan.edu.pe
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
                        está destinado exclusivamente al ponente mencionado. Queda
                        estrictamente prohibida la compartición de cualquier parte
                        de este mensaje con terceros sin el consentimiento por escrito
                        por la corporación Sayan. En caso de recepción errónea, le
                        solicitamos responder a este correo y proceder a su eliminación.
                        Agradecemos su colaboración y comprensión en este asunto.
                    </Text>
                </Container>
            </Body>
        </Html >
    );
}
SayanEmailTemplate.PreviewProps = {
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
  } as SayanEmailTemplateProps;
  

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

};

const validityText = {
    ...text,
    margin: "0px",

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
