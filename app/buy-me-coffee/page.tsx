"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";

// Função para gerar o payload PIX no formato EMV
function generatePixPayload(
  pixKey: string,
  merchantName: string = "Crohnnected",
  amount?: number
): string {
  // Função auxiliar para formatar campos EMV
  const formatEMV = (id: string, value: string): string => {
    const length = value.length.toString().padStart(2, "0");
    return `${id}${length}${value}`;
  };

  // Payload Format Indicator
  let payload = formatEMV("00", "01");

  // Merchant Account Information
  const gui = formatEMV("00", "br.gov.bcb.pix"); // GUI do PIX
  const key = formatEMV("01", pixKey); // Chave PIX
  const merchantAccountInfo = formatEMV("26", gui + key);
  payload += merchantAccountInfo;

  // Merchant Category Code (0000 = não especificado)
  payload += formatEMV("52", "0000");

  // Transaction Currency (986 = BRL)
  payload += formatEMV("53", "986");

  // Transaction Amount (opcional)
  if (amount && amount > 0) {
    payload += formatEMV("54", amount.toFixed(2));
  }

  // Country Code
  payload += formatEMV("58", "BR");

  // Merchant Name
  payload += formatEMV("59", merchantName);

  // Merchant City
  payload += formatEMV("60", "Sao Paulo");

  // Additional Data Field Template (opcional)
  const txid = "***"; // Transaction ID
  const additionalData = formatEMV("05", txid);
  payload += formatEMV("62", additionalData);

  // CRC16 placeholder
  payload += "6304";

  // Calcular CRC16
  const crc16 = calculateCRC16(payload);
  payload += crc16;

  return payload;
}

// Função para calcular CRC16 CCITT
function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }

  crc = crc & 0xffff;
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function PixQr({ pixKey }: { pixKey: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const pixPayload = generatePixPayload(pixKey);

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("coffee.qrCodeTitle")}</CardTitle>
          <CardDescription>{t("coffee.qrCodeDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {/* QR Code */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <QRCodeSVG value={pixPayload} size={256} level="M" />
          </div>

          {/* Chave PIX */}
          <div className="w-full space-y-2">
            <p className="text-sm font-medium text-center">
              {t("coffee.pixKey")}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-muted rounded-md">
                <p className="font-mono text-sm break-all text-center">
                  {pixKey}
                </p>
              </div>
              <Button
                variant="whiteline"
                size="icon"
                onClick={handleCopyKey}
                title={t("coffee.copyPixKey")}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 text-center">
                {t("coffee.keyCopied")}
              </p>
            )}
          </div>

          {/* Código PIX Copia e Cola */}
          <div className="w-full space-y-2">
            <p className="text-sm font-medium text-center">
              {t("coffee.pixCodeCopyPaste")}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-muted rounded-md max-h-24 overflow-y-auto">
                <p className="font-mono text-xs break-all">{pixPayload}</p>
              </div>
              <Button
                variant="whiteline"
                size="icon"
                onClick={handleCopyPayload}
                title={t("coffee.copyPixCode")}
              >
                {copiedPayload ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copiedPayload && (
              <p className="text-xs text-green-600 text-center">
                {t("coffee.codeCopied")}
              </p>
            )}
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              💡 <strong>{t("coffee.howToUse")}</strong>{" "}
              {t("coffee.howToUseDesc")}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BuyMeCoffeePage() {
  const { t } = useLanguage();
  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || "";

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{t("coffee.title")}</h1>
          <p className="text-muted-foreground">{t("coffee.description")}</p>
        </div>

        {pixKey ? (
          <PixQr pixKey={pixKey} />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertDescription>
                  <p className="font-medium mb-2">{t("coffee.noPixKey")}</p>
                  <p className="text-sm">
                    {t("coffee.noPixKeyDesc", {
                      env: '<code class="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_PIX_KEY</code>',
                    })}
                  </p>
                  <p className="text-sm mt-2">{t("coffee.noPixKeyInfo")}</p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        <p className="text-sm text-muted-foreground text-center">
          {t("coffee.thankYou")}
        </p>
      </div>
    </main>
  );
}
