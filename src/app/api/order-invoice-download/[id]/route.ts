import prisma from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { findDiscountByRole } from "@/utils/database/discount.query";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        payment: true,
        shipment: true,
        referal: true,
        user: true,
        items: {
          include: { custom_request: true, product: true, variant: true },
        },
      },
    });

    const discount = order ? await findDiscountByRole(order.user.role) : null;

    if (!order)
      return NextResponse.json(
        { status: 404, message: "Order is not found" },
        {
          status: 404,
        },
      );

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4

    // Embed fonts
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Constants for layout
    const margin = 50;
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    // Add background header strip
    page.drawRectangle({
      x: 0,
      y: pageHeight - 130,
      width: pageWidth,
      height: 120,
      color: rgb(0.07058823529411765, 0.2980392156862745, 0.7333333333333333),
    });

    // Header
    page.drawText("Tirai.id INVOICE", {
      x: margin,
      y: pageHeight - 70,
      size: 32,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    // Invoice details
    page.drawText(`Invoice #: ${order.id}`, {
      x: margin,
      y: pageHeight - 100,
      size: 12,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    page.drawText(`Date: ${new Date(order.created_at).toLocaleDateString()}`, {
      x: margin,
      y: pageHeight - 120,
      size: 12,
      font: helvetica,
      color: rgb(1, 1, 1),
    });

    // Add divider line
    page.drawLine({
      start: { x: margin, y: pageHeight - 140 },
      end: { x: pageWidth - margin, y: pageHeight - 140 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Customer details section
    page.drawText("BILL TO", {
      x: margin,
      y: pageHeight - 180,
      size: 14,
      font: helveticaBold,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(`${order.user.name}`, {
      x: margin,
      y: pageHeight - 205,
      size: 12,
      font: helveticaBold,
    });

    page.drawText(`${order.shipping_address}`, {
      x: margin,
      y: pageHeight - 225,
      size: 11,
      font: helvetica,
      maxWidth: 250,
      lineHeight: 14,
    });

    // Shipment details if available
    if (order.shipment?.status === "DELIVERED") {
      page.drawText("SHIPPING DETAILS", {
        x: pageWidth - 250,
        y: pageHeight - 180,
        size: 14,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });

      page.drawText(`Carrier: ${order.shipment.carrier}`, {
        x: pageWidth - 250,
        y: pageHeight - 205,
        size: 11,
        font: helvetica,
      });

      if (order.shipment.tracking_id) {
        page.drawText(`Tracking ID: ${order.shipment.tracking_id}`, {
          x: pageWidth - 250,
          y: pageHeight - 225,
          size: 11,
          font: helvetica,
        });
      }
    }

    // Increased margin between shipping address and items table
    const itemsStartY = pageHeight - 320; // Moved down by 40 units

    // Items table background
    page.drawRectangle({
      x: margin,
      y: itemsStartY,
      width: pageWidth - margin * 2,
      height: 30,
      color: rgb(0.95, 0.95, 0.95),
    });

    // Table headers
    const columns = {
      item: margin + 15,
      qty: 300,
      price: 400,
      total: 480,
    };

    ["Item", "Qty", "Price", "Total"].forEach((header, index) => {
      const x = Object.values(columns)[index];
      page.drawText(header, {
        x,
        y: itemsStartY + 15,
        size: 12,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });
    });

    // Draw items
    let yPosition = itemsStartY - 30;
    order.items.forEach((item, index) => {
      const itemName =
        item.product?.name || item.variant?.name || "Custom Request";
      const itemPrice =
        item.product?.price ||
        item.variant?.price ||
        item.custom_request?.price ||
        0;
      const total = itemPrice * item.quantity;

      // Alternate row background
      if (index % 2 === 1) {
        page.drawRectangle({
          x: margin,
          y: yPosition - 5,
          width: pageWidth - margin * 2,
          height: 25,
          color: rgb(0.98, 0.98, 0.98),
        });
      }

      page.drawText(itemName, {
        x: columns.item,
        y: yPosition,
        size: 11,
        font: helvetica,
      });

      page.drawText(`x${item.quantity}`, {
        x: columns.qty,
        y: yPosition,
        size: 11,
        font: helvetica,
      });

      page.drawText(`${formatRupiah(itemPrice)}`, {
        x: columns.price,
        y: yPosition,
        size: 11,
        font: helvetica,
      });

      page.drawText(`${formatRupiah(total)}`, {
        x: columns.total,
        y: yPosition,
        size: 11,
        font: helvetica,
      });

      yPosition -= 30;
    });

    // Improved summary section with better spacing and contrast
    const summaryX = pageWidth - 230;
    const totalValueX = pageWidth - 130;

    // Summary box with softer background
    page.drawRectangle({
      x: pageWidth - 250,
      y: yPosition - 120,
      width: 200,
      height: 140,
      color: rgb(0.97, 0.97, 0.97),
      borderWidth: 1,
      borderColor: rgb(0.9, 0.9, 0.9),
    });

    // Subtotal
    yPosition -= 20; // Add some space before summary
    page.drawText("Subtotal:", {
      x: summaryX,
      y: yPosition,
      size: 8,
      font: helveticaBold,
    });

    page.drawText(`${formatRupiah(order.total_price - order.shipping_price)}`, {
      x: totalValueX,
      y: yPosition,
      size: 8,
      font: helvetica,
    });

    // Shipping
    page.drawText("Shipping:", {
      x: summaryX,
      y: yPosition - 25,
      size: 8,
      font: helveticaBold,
    });

    page.drawText(`${formatRupiah(order.shipping_price)}`, {
      x: totalValueX,
      y: yPosition - 25,
      size: 8,
      font: helvetica,
    });

    // Discount if applicable
    if (discount) {
      const discountAmount =
        (order.total_price * discount.discount_in_percent) / 100;
      page.drawText(`General Discount (${discount.discount_in_percent}%):`, {
        x: summaryX,
        y: yPosition - 50,
        size: 8,
        font: helveticaBold,
      });

      page.drawText(`- ${formatRupiah(discountAmount)}`, {
        x: totalValueX,
        y: yPosition - 50,
        size: 8,
        font: helvetica,
        color: rgb(
          0.10980392156862745,
          0.9882352941176471,
          0.011764705882352941,
        ),
      });
    }

    // Referal Discount if applicable
    if (order.referal?.discount_in_percent) {
      const discountAmount =
        (order.total_price * order.referal.discount_in_percent) / 100;
      page.drawText(
        `Referal Discount (${order.referal.discount_in_percent}%):`,
        {
          x: summaryX,
          y: yPosition - (discount ? 75 : 50),
          size: 8,
          font: helveticaBold,
        },
      );

      page.drawText(`- ${formatRupiah(discountAmount)}`, {
        x: totalValueX,
        y: yPosition - (discount ? 75 : 50),
        size: 8,
        font: helvetica,
        color: rgb(
          0.10980392156862745,
          0.9882352941176471,
          0.011764705882352941,
        ),
      });
    }

    // Improved total section with better contrast
    page.drawRectangle({
      x: pageWidth - 250,
      y: yPosition - (discount ? 125 : 100),
      width: 200,
      height: 40,
      color: rgb(0.07058823529411765, 0.2980392156862745, 0.7333333333333333),
    });

    page.drawText("Total:", {
      x: summaryX,
      y: yPosition - (discount ? 110 : 85),
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    page.drawText(`${formatRupiah(order.total_price)}`, {
      x: totalValueX - 10, // Slight adjustment for better alignment
      y: yPosition - (discount ? 110 : 85),
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    // Payment details if available
    if (order.payment) {
      yPosition -= 160;
      page.drawText("Payment Information", {
        x: margin,
        y: yPosition,
        size: 14,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });

      page.drawText(`Method: ${order.payment.method}`, {
        x: margin,
        y: yPosition - 25,
        size: 11,
        font: helvetica,
      });

      if (order.payment.transaction_id) {
        page.drawText(`Transaction ID: ${order.payment.transaction_id}`, {
          x: margin,
          y: yPosition - 45,
          size: 11,
          font: helvetica,
        });
      }
    }

    // Footer with thank you message
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: 70,
      color: rgb(0.95, 0.95, 0.95),
    });

    page.drawText("Thank you for your business!", {
      x: pageWidth / 2 - 80,
      y: 30,
      size: 14,
      font: helveticaBold,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Generate PDF
    const pdfBytes = await pdfDoc.save();

    const buffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;

    return new NextResponse(new Blob([buffer]), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { status: 500, message: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
