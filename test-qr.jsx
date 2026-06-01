import QRCodeLib from "react-qr-code";

const QRCode = typeof QRCodeLib === "function" ? QRCodeLib : QRCodeLib.default || QRCodeLib.QRCode;

export default function TestQr() {
  return <QRCode value="123" />;
}
