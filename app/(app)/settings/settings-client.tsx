"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FieldWrapper } from "@/components/forms/field-wrapper"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validations/settings"
import { AlertTriangle } from "lucide-react"

function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "홍길동",
      email: "user@example.com",
      bio: "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    await new Promise((r) => setTimeout(r, 500))
    toast.success("프로필이 저장되었습니다.")
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>프로필</CardTitle>
          <CardDescription>공개 프로필 정보를 관리하세요.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldWrapper
            label="이름"
            htmlFor="name"
            error={errors.name?.message}
            required
          >
            <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          </FieldWrapper>

          <FieldWrapper
            label="이메일"
            htmlFor="email"
            error={errors.email?.message}
            required
          >
            <Input
              id="email"
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
          </FieldWrapper>

          <FieldWrapper
            label="소개"
            htmlFor="bio"
            error={errors.bio?.message}
            description="최대 200자까지 입력할 수 있습니다."
          >
            <Textarea
              id="bio"
              rows={3}
              placeholder="자신을 소개해주세요."
              {...register("bio")}
              aria-invalid={!!errors.bio}
            />
          </FieldWrapper>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

function NotificationForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>알림</CardTitle>
        <CardDescription>알림 수신 방식을 설정하세요.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications" className="text-sm font-medium">
              이메일 알림
            </Label>
            <p className="text-xs text-muted-foreground">
              주요 이벤트를 이메일로 받습니다.
            </p>
          </div>
          <Switch id="email-notifications" defaultChecked />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="push-notifications" className="text-sm font-medium">
              푸시 알림
            </Label>
            <p className="text-xs text-muted-foreground">
              브라우저 푸시 알림을 받습니다.
            </p>
          </div>
          <Switch id="push-notifications" />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="marketing-emails" className="text-sm font-medium">
              마케팅 이메일
            </Label>
            <p className="text-xs text-muted-foreground">
              새로운 기능 및 업데이트 소식을 받습니다.
            </p>
          </div>
          <Switch id="marketing-emails" />
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <Label className="text-sm font-medium">알림 빈도</Label>
          <RadioGroup defaultValue="daily">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="realtime" id="realtime" />
              <Label htmlFor="realtime" className="cursor-pointer font-normal">
                실시간
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="cursor-pointer font-normal">
                일간 요약
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="cursor-pointer font-normal">
                주간 요약
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => toast.success("알림 설정이 저장되었습니다.")}>
          저장
        </Button>
      </CardFooter>
    </Card>
  )
}

function AppearanceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>외관</CardTitle>
        <CardDescription>앱의 테마를 설정하세요.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">다크 모드</p>
          <p className="text-xs text-muted-foreground">
            라이트 / 다크 테마를 전환합니다.
          </p>
        </div>
        <ThemeToggle />
      </CardContent>
    </Card>
  )
}

function SecurityTab() {
  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={(e) => { e.preventDefault(); toast.success("비밀번호가 변경되었습니다.") }}>
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
            <CardDescription>계정 보안을 위해 주기적으로 변경하세요.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FieldWrapper label="현재 비밀번호" htmlFor="current-password">
              <Input id="current-password" type="password" />
            </FieldWrapper>
            <FieldWrapper
              label="새 비밀번호"
              htmlFor="new-password"
              description="영문 대소문자와 숫자를 포함해 8자 이상 입력하세요."
            >
              <Input id="new-password" type="password" />
            </FieldWrapper>
            <FieldWrapper label="새 비밀번호 확인" htmlFor="confirm-password">
              <Input id="confirm-password" type="password" />
            </FieldWrapper>
          </CardContent>
          <CardFooter>
            <Button type="submit">변경</Button>
          </CardFooter>
        </Card>
      </form>

      <Alert variant="destructive">
        <AlertTriangle className="size-4" />
        <AlertTitle>위험 구역</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-3">
          <p>계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다.</p>
          <Button variant="destructive" size="sm" className="w-fit">
            계정 삭제
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

export function SettingsClient() {
  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더 */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">홈</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>설정</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* 본문 */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">설정</h1>
          <p className="text-sm text-muted-foreground">
            계정 및 앱 환경설정을 관리하세요.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="notifications">알림</TabsTrigger>
            <TabsTrigger value="appearance">외관</TabsTrigger>
            <TabsTrigger value="security">보안</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationForm />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceTab />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
