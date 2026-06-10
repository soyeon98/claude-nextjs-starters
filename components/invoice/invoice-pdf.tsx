import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer"
import path from "path"
import type { InvoiceDetail, InvoiceItem } from "@/types"

Font.register({
  family: "NotoSansKR",
  fonts: [
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansKR-Regular.ttf"),
      fontWeight: 400,
    },
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansKR-Bold.ttf"),
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansKR",
    fontSize: 10,
    padding: 40,
    color: "#111827",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
  },
  section: {
    marginBottom: 16,
  },
  recipientBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    padding: "8 12",
    marginBottom: 16,
  },
  recipientText: {
    fontSize: 11,
    fontWeight: 700,
  },
  recipientSub: {
    fontSize: 10,
    color: "#6b7280",
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
    paddingVertical: 6,
  },
  colName: { flex: 3, paddingLeft: 8 },
  colUnit: { flex: 2, textAlign: "right" },
  colQty: { flex: 1, textAlign: "right" },
  colAmount: { flex: 2, textAlign: "right", paddingRight: 8 },
  headerText: { fontSize: 9, fontWeight: 700, color: "#374151" },
  cellText: { fontSize: 10 },
  mutedText: { fontSize: 9, color: "#9ca3af" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  totalBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    padding: "8 16",
  },
  totalLabel: { fontSize: 11, fontWeight: 700 },
  totalAmount: { fontSize: 14, fontWeight: 700 },
})

function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`
}

function ItemRow({ item }: { item: InvoiceItem }) {
  const isIncluded = item.quantity === 0
  return (
    <View style={styles.tableRow}>
      <View style={styles.colName}>
        <Text style={styles.cellText}>{item.name}</Text>
      </View>
      <View style={styles.colUnit}>
        <Text style={styles.cellText}>{formatCurrency(item.unitPrice)}</Text>
      </View>
      <View style={styles.colQty}>
        {isIncluded ? (
          <Text style={styles.mutedText}>포함</Text>
        ) : (
          <Text style={styles.cellText}>{item.quantity}</Text>
        )}
      </View>
      <View style={styles.colAmount}>
        {isIncluded ? (
          <Text style={styles.mutedText}>—</Text>
        ) : (
          <Text style={styles.cellText}>{formatCurrency(item.amount)}</Text>
        )}
      </View>
    </View>
  )
}

export function InvoicePdf({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.section}>
          <Text style={styles.title}>{invoice.title}</Text>
          <Text style={styles.subtitle}>발행일: {invoice.issueDate}</Text>
          <Text style={styles.subtitle}>유효기간: {invoice.validUntil}</Text>
        </View>

        {/* 수신자 */}
        <View style={styles.recipientBox}>
          <Text style={styles.recipientText}>
            {invoice.clientName}{" "}
            <Text style={styles.recipientSub}>귀중</Text>
          </Text>
        </View>

        {/* 견적 항목 테이블 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>견적 항목</Text>
          <View style={styles.tableHeader}>
            <View style={styles.colName}>
              <Text style={styles.headerText}>항목명</Text>
            </View>
            <View style={styles.colUnit}>
              <Text style={styles.headerText}>단가 (₩)</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.headerText}>수량</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={styles.headerText}>금액 (₩)</Text>
            </View>
          </View>
          {invoice.items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </View>

        {/* 합계 */}
        <View style={styles.totalRow}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>합계</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(invoice.totalAmount)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
