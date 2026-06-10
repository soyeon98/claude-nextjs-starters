import type { Metadata } from "next"

export const metadata: Metadata = { title: "이용약관" }

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">이용약관</h1>
      <p className="mb-10 text-sm text-muted-foreground">최종 업데이트: 2026년 1월 1일</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">제1조 (목적)</h2>
          <p>
            이 약관은 견적서 공유 서비스(이하 “서비스”)의 이용과 관련하여 서비스와 이용자 간의 권리,
            의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">제2조 (정의)</h2>
          <p>
            “이용자”란 이 약관에 따라 서비스가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">제3조 (약관의 효력 및 변경)</h2>
          <p>
            이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을
            발생합니다. 서비스는 합리적인 사유가 발생할 경우 약관을 변경할 수 있으며, 변경된 약관은
            공지 후 효력을 발생합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">제4조 (서비스의 제공)</h2>
          <p>
            서비스는 이용자에게 아래와 같은 서비스를 제공합니다. 서비스의 내용은 기술적 사유 또는
            서비스 운영상의 이유로 변경될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">제5조 (면책조항)</h2>
          <p>
            서비스는 천재지변, 전쟁, 기타 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는
            경우에는 서비스 제공에 관한 책임이 면제됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">제6조 (문의)</h2>
          <p>
            이용약관에 관한 문의사항은 아래 연락처로 문의하시기 바랍니다.
            <br />
            이메일: legal@example.com
          </p>
        </section>
      </div>
    </div>
  )
}
