import {
    Body,
    Container,
    Column,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface BinexEmailTemplateProps {
    name?: string;
    message?: string;
    curso?: string;
}

export const BinexEmailTemplate = ({
    name,
    message,
    curso = "binex",
}: BinexEmailTemplateProps) => {

    return (
        <Html>
            <Head />
            <Preview>{curso}</Preview>
            <Body style={main}>
                <Section style={logo}>
                    <Img width={220} src="https://binex.edu.pe/_next/image?url=%2Fimg%2Flogo%2Flogobinex.png&w=828&q=75" />
                </Section>
                <Container style={{ ...container, borderRadius: "10px" }}>
                    <Section style={content}>
                        <Text style={paragraph}>¡Hola! {name},</Text>
                        <Text style={{...paragraph, textAlign: "justify"}}>
                            ¡Felicidades! Nos complace anunciar que has completado con éxito el
                            curso de <strong>{curso}</strong> organizado por Binex. Adjunto a este
                            correo encontrarás tu certificado oficial, que reconoce tu dedicación
                            y esfuerzo.
                        </Text>
                        <Text style={paragraph}>
                            <strong>Materiales utilizados en el Curso:</strong> 
                        </Text>
                        <pre style={paragraph}>{message}</pre> {/* Cambio aquí */}

                        <Text style={paragraph}>
                            Consultas al {" "}

                            <Link href="https://wa.link/v28ncq" style={link}>
                                +51 921814045
                            </Link>

                        </Text>
                        <Text style={paragraph}>
                            Gracias,
                            <br />
                            Área de certificación Binex
                        </Text>
                    </Section>
                </Container>

                <Section style={footer}>
                    <Row>
                        <Column align="center" style={{ width: "20%", paddingBottom: "20px" }}>
                            <Img
                                width={118}
                                style={{ borderRadius: "100px", marginRight: "5px" }}
                                src="https://lh3.googleusercontent.com/a/ACg8ocL0soO_qo0ODi2eZcZeQfqFc-NfVB4ilhJP5E1Eysee_vry_7j4=s346-c-no"
                            />
                        </Column>
                        <Column align="left" style={{ width: "30%", paddingBottom: "20px" }}>
                            <Text style={paragraph2}><strong>BINEX Educación Continua</strong></Text>
                            <Text style={paragraph2}>Área de certificación</Text>
                            <Text style={paragraph2}>
                                <strong>Teléfono:</strong>  +51 921814045
                            </Text>
                            <Text style={paragraph2}>
                                <strong>Dirección:</strong> Jr, Lambayeque N° 1014, Juliaca 21001
                            </Text>
                            <Text style={{...paragraph2, color: "#fff"}}>
                                <strong>Correo:</strong> <Link style={{color: "#fff"}}>binexeducacion@gmail.com</Link>  
                            </Text>
                            <Text style={paragraph2}>
                                <strong>Sitio Web:</strong> <Link style={{color: "#fff"}} href="https://binex.edu.pe/">binex.edu.pe</Link>
                            </Text>
                        </Column>
                    </Row>
                    <Row>
                        <Column align="right" style={{ width: "33%", paddingRight: "0px" }}>
                            <Link href="https://web.facebook.com/BinexEdu">
                                <Img
                                    width={32}
                                    src="https://i.postimg.cc/DZvd6cYk/facebook.png"
                                />
                            </Link>
                        </Column>
                        <Column align="center" style={{ width: "10%", paddingLeft: "8px" }}>
                            <Link href="https://www.tiktok.com/@binex.ec">
                                <Img
                                    width={32}
                                    src="https://i.postimg.cc/j2nTFsqB/image.png"
                                />
                            </Link>
                        </Column>
                        <Column align="left" style={{ width: "33%", paddingLeft: "8px" }}>
                            <Link href="https://www.instagram.com/binex.ec/">
                                <Img
                                    width={32}
                                    src="https://i.postimg.cc/4nCGCrmy/image-1.png"
                                />
                            </Link>
                        </Column>
                    </Row>

                    <Row>
                        <Text style={{ textAlign: "justify", color: "#fff" }}>
                            El contenido de este correo electrónico es confidencial y
                            está destinado exclusivamente a los participantes de los
                            diplomados y/o cursos ofrecidos por BINEX educación continua.
                            Queda estrictamente prohibido compartir cualquier parte de
                            este mensaje con terceros sin el consentimiento por escrito
                            de Ecomás Consultoría y Capacitación. En caso de haber recibido
                            este mensaje por error, le solicitamos que responda a este
                            correo y proceda a su eliminación. Agradecemos su cooperación
                            y comprensión en este asunto.
                        </Text>
                    </Row>
                </Section>
            </Body>
        </Html>
    );
};

BinexEmailTemplate.PreviewProps = {
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
} as BinexEmailTemplateProps;

export default BinexEmailTemplate;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
    backgroundColor: "#039F85",
    fontFamily,
    padding: "20px",
};

const paragraph = {
    lineHeight: 1.5,
    fontSize: 14,
    color: "",
};


const paragraph2 = {
    lineHeight: 1.4,
    fontSize: 14,
    color: "#fff",
    margin: "0 0",

};

const container = {
    maxWidth: "580px",
    margin: "30px auto",
    backgroundColor: "#ffffff",

};

const footer = {
    maxWidth: "580px",
    margin: "0 auto",
};

const content = {
    padding: "5px 20px 10px 20px",
};

const logo = {
    display: "flex",
    justifyContent: "center",
    alingItems: "center",
    padding: 20,
};
const link = {
    textDecoration: "underline",
};
const iconStyle = {
    marginRight: '10px',
    verticalAlign: 'middle',
};