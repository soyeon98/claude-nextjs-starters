import type { Metadata } from "next"

export const metadata: Metadata = { title: "개인정보처리방침" }

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">개인정보처리방침</h1>
      <p className="mb-10 text-sm text-muted-foreground">최종 업데이트: 2026년 1월 1일</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">1. 수집하는 개인정보</h2>
          <p>
            서비스 이용 과정에서 이름, 이메일 주소, 서비스 이용 기록 등의 개인정보가 수집될 수
            있습니다. 수집 목적 이외의 용도로 사용하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">2. 개인정보의 이용 목적</h2>
          <p>
            수집된 개인정보는 서비스 제공, 고객 지원, 서비스 개선 등의 목적으로만 사용됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">3. 개인정보의 보유 및 파기</h2>
          <p>
            개인정보는 수집 목적이 달성된 후 지체 없이 파기합니다. 단, 관련 법령에 따라 일정 기간
            보관이 필요한 경우에는 해당 기간 동안 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">4. 개인정보의 제3자 제공</h2>
          <p>
            이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의한 경우는
            예외로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">5. 문의</h2>
          <p>
            개인정보 처리에 관한 문의사항은 아래 연락처로 문의하시기 바랍니다.
            <br />
            이메일: privacy@example.com
          </p>
        </section>
      </div>
    </div>
  )
}
