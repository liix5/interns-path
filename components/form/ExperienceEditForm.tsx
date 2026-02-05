"use client";

import { useEffect, useState } from "react";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check, Star, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { updateExperience } from "@/app/lib/actions";
import { City } from "@/app/lib/definitions";
import { ProfessionRequestForm } from "./professionReqForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Schemas
const step1Schema = z.object({
  profession_id: z.number().min(1, "الرجاء اختيار التخصص"),
  city_id: z.number().min(1, "الرجاء اختيار المدينة"),
  place: z.string().min(2, "الرجاء إدخال اسم المكان"),
});

const step2Schema = z.object({
  year: z.string().min(1, "الرجاء تحديد سنة و شهر بدايتك في المكان"),
  rotation: z.string().optional(),
  working_hours: z.string().optional(),
});

const step3Schema = z.object({
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  departments: z.string().min(3, "الأقسام يجب أن تكون 3 أحرف على الأقل"),
  requirements: z.string().optional(),
  interview_info: z.string().optional(),
});

const step4Schema = z.object({
  positives: z.string().min(3, "الإيجابيات يجب أن تكون 3 أحرف على الأقل"),
  negatives: z.string().min(3, "السلبيات يجب أن تكون 3 أحرف على الأقل"),
  tags: z.array(z.string()).optional(),
  rating: z.number().min(1, "التقييم مطلوب").max(5),
  contact: z.string().optional(),
});

const formSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

// Helpers
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= 2018; i--) {
    years.push(i.toString());
  }
  return years;
};
const months = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];
const years = generateYears();

// Step Components - Same as in multi-stepsForm.tsx
const Step1 = ({
  professions,
  cities,
}: {
  professions: any[];
  cities: City[];
}) => {
  const { control } = useFormContext();
  const [professionOpen, setProfessionOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  return (
    <>
      {/* Profession */}
      <FormField
        control={control}
        name="profession_id"
        render={({ field }) => (
          <FormItem dir="rtl" className="w-full">
            <FormLabel>التخصص</FormLabel>
            <Popover open={professionOpen} onOpenChange={setProfessionOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between ",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value
                      ? professions.find((p) => p.id === field.value)?.name
                      : "اختر التخصص"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 rtl:mr-2 rtl:ml-0" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" dir="rtl">
                <Command>
                  <CommandInput placeholder="ابحث عن تخصص..." className="h-9" />
                  <CommandEmpty>لم يتم العثور على تخصص.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {professions.map((p) => (
                      <CommandItem
                        key={p.id}
                        value={p.id}
                        onSelect={() => {
                          field.onChange(p.id);
                          setProfessionOpen(false);
                        }}
                      >
                        {p.name}
                        <Check
                          className={cn(
                            "mr-auto h-4 w-4 rtl:ml-auto rtl:mr-0",
                            field.value === p.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
            <p className="text-sm">
              لم تجد تخصصك؟ <ProfessionRequestForm source="صفحة التجربة" />
            </p>
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={control}
        name="city_id"
        render={({ field }) => (
          <FormItem dir="rtl" className="w-full">
            <FormLabel>المدينة</FormLabel>
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value
                      ? cities.find((c) => Number(c.id) === field.value)
                          ?.name_ar
                      : "اختر المدينة"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 rtl:mr-2 rtl:ml-0" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" dir="rtl">
                <Command>
                  <CommandInput
                    placeholder="ابحث عن مدينة..."
                    className="h-9"
                  />
                  <CommandEmpty>لم يتم العثور على مدينة.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {cities.map((c) => (
                      <CommandItem
                        key={c.id}
                        value={c.id}
                        onSelect={() => {
                          field.onChange(Number(c.id));
                          setCityOpen(false);
                        }}
                      >
                        {c.name_ar}
                        <Check
                          className={cn(
                            "mr-auto h-4 w-4 rtl:ml-auto rtl:mr-0",
                            field.value === Number(c.id)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Place */}
      <FormField
        control={control}
        name="place"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>المكان</FormLabel>
            <FormControl>
              <Input placeholder="اسم المستشفى أو المركز" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const Step2 = () => {
  const { control } = useFormContext();
  return (
    <>
      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem dir="rtl" className="flex flex-col w-full">
            <FormLabel>السنة والشهر</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-right font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value || "اختر سنة وشهر بداية تجربتك"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="flex justify-between gap-0.5 p-2">
                  {/* Month */}
                  <Select
                    onValueChange={(value) => {
                      const [y, m] = field.value
                        ? field.value.split("-")
                        : ["", ""];
                      const newMonth = months.indexOf(value) + 1;
                      field.onChange(
                        `${y || years[0]}-${newMonth
                          .toString()
                          .padStart(2, "0")}`,
                      );
                    }}
                    value={
                      field.value
                        ? months[parseInt(field.value.split("-")[1]) - 1]
                        : undefined
                    }
                  >
                    <SelectTrigger className="w-1/2 rounded-l-none">
                      <SelectValue placeholder="شهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m, i) => (
                        <SelectItem key={i} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Year */}
                  <Select
                    onValueChange={(value) => {
                      const [, m] = field.value
                        ? field.value.split("-")
                        : ["", "01"];
                      field.onChange(`${value}-${m}`);
                    }}
                    value={field.value ? field.value.split("-")[0] : undefined}
                  >
                    <SelectTrigger className="w-1/2 rounded-r-none">
                      <SelectValue placeholder="سنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y, i) => (
                        <SelectItem key={i} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="rotation"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>الروتيشن</FormLabel>
            <FormControl>
              <Input placeholder="مثال: الاول" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="working_hours"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>ساعات العمل </FormLabel>
            <FormControl>
              <Input placeholder="مثال: من ٨ صباحاً إلى ٤ مساءً" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const Step3 = () => {
  const { control } = useFormContext();
  return (
    <>
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>الوصف</FormLabel>
            <FormControl>
              <Textarea
                className="min-h-60"
                placeholder="تحدث عن تجربتك بالتفصيل"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="departments"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>الأقسام</FormLabel>
            <FormControl>
              <Textarea
                className="min-h-18"
                placeholder="أقسام المستشفى مفصولة بفاصلة"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="requirements"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>المتطلبات </FormLabel>
            <FormControl>
              <Input placeholder="مقابلة, ستيب, اختبار ... " {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="interview_info"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>معلومات المقابلة (اختياري)</FormLabel>
            <FormControl>
              <Textarea
                className="max-h-40"
                placeholder="نوعيه الاسئله المطروحه ،المواضيع التي تم التركيز عليها ... "
                {...field}
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const Step4 = ({ tags }: { tags: string[] }) => {
  const { control, setValue, watch } = useFormContext();
  const currentTags = watch("tags");

  return (
    <>
      <FormField
        control={control}
        name="positives"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>الإيجابيات</FormLabel>
            <FormControl>
              <Textarea
                className="max-h-40"
                placeholder="الجوانب الإيجابية"
                {...field}
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="negatives"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>السلبيات</FormLabel>
            <FormControl>
              <Textarea
                className="max-h-40"
                placeholder="الجوانب السلبية"
                {...field}
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>التقييم</FormLabel>
            <FormControl>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 cursor-pointer ${
                      i < field.value
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => field.onChange(i + 1)}
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الوسوم</FormLabel>
            <FormControl>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      currentTags.includes(tag) ? "secondary" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => {
                      if (currentTags.includes(tag)) {
                        setValue(
                          "tags",
                          currentTags.filter((t: string) => t !== tag),
                          { shouldDirty: true, shouldValidate: true },
                        );
                      } else {
                        setValue("tags", [...currentTags, tag], {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="contact"
        render={({ field }) => (
          <FormItem dir="rtl">
            <FormLabel>معلومات التواصل (اختياري)</FormLabel>
            <FormControl>
              <Input
                placeholder="رقم الجوال أو حساب التواصل الاجتماعي "
                {...field}
              />
            </FormControl>
            <FormDescription className="text-xs">
              سيتمكن المستخدمون من التواصل معك لطرح الأسئلة
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const formSteps = [
  {
    id: "step-1",
    title: "المعلومات الأساسية",
    schema: step1Schema,
    component: Step1,
  },
  {
    id: "step-2",
    title: "وقت الروتيشن ",
    schema: step2Schema,
    component: Step2,
  },
  { id: "step-3", title: "الوصف", schema: step3Schema, component: Step3 },
  {
    id: "step-4",
    title: "تفاصيل إضافية",
    schema: step4Schema,
    component: Step4,
  },
];

type ExperienceFormValues = z.infer<typeof formSchema>;

export default function ExperienceEditForm({
  experience,
  professions,
  tags,
  cities,
}: {
  experience: any;
  professions: any[];
  tags: string[];
  cities: City[];
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editToken, setEditToken] = useState<string | null>(null);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const router = useRouter();

  // Format year from database (handles Date object, YYYY-MM-DD, or YYYY-MM formats)
  const formatYear = (yearValue: any) => {
    if (!yearValue) return "";

    // If it's a Date object
    if (yearValue instanceof Date) {
      return `${yearValue.getFullYear()}-${(yearValue.getMonth() + 1).toString().padStart(2, "0")}`;
    }

    if (typeof yearValue === "string") {
      // If it's YYYY-MM-DD format, extract YYYY-MM
      if (yearValue.match(/^\d{4}-\d{2}-\d{2}/)) {
        return yearValue.slice(0, 7);
      }
      // If it's already in YYYY-MM format
      if (yearValue.match(/^\d{4}-\d{2}$/)) return yearValue;
      // Try parsing as date string
      const date = new Date(yearValue);
      if (!isNaN(date.getTime())) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      }
    }

    return "";
  };

  const methods = useForm<ExperienceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profession_id: experience.profession_id || 0,
      city_id: experience.city_id || 0,
      year: formatYear(experience.year),
      place: experience.place || "",
      rotation: experience.rotation || "",
      working_hours: experience.working_hours || "",
      description: experience.description || "",
      positives: experience.positives || "",
      negatives: experience.negatives || "",
      departments: experience.departments || "",
      requirements: experience.requirements || "",
      rating: experience.rating || 0,
      tags: (experience.tags || []) as string[],
      interview_info: experience.interview_info || "",
      contact: experience.contact || "",
    },
    mode: "onSubmit",
  });

  const { trigger, handleSubmit } = methods;
  const CurrentComponent = formSteps[currentStep].component;
  const isFinalStep = currentStep === formSteps.length - 1;

  useEffect(() => {
    // Check if user has edit token for this experience
    const editTokens = JSON.parse(
      localStorage.getItem("experienceEditTokens") || "{}",
    );
    const token = editTokens[experience.id];

    if (!token) {
      toast.error("ليس لديك صلاحية لتعديل هذه التجربة");
      router.push(`/experience/${experience.id}`);
      return;
    }

    setEditToken(token);
  }, [experience.id, router]);

  const handleNextStep = async () => {
    const isStepValid = await trigger(
      Object.keys(
        formSteps[currentStep].schema.shape,
      ) as (keyof ExperienceFormValues)[],
    );
    if (isStepValid) {
      setAllowSubmit(false); // Reset on step change
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevStep = () => {
    setAllowSubmit(false);
    setCurrentStep((s) => s - 1);
  };

  // Enable submit only after user has been on final step
  useEffect(() => {
    if (isFinalStep) {
      // Small delay to prevent auto-submission on step change
      const timer = setTimeout(() => setAllowSubmit(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isFinalStep]);

  const onSubmit = async (data: any) => {
    // Prevent accidental auto-submission when step changes
    if (!allowSubmit) {
      return;
    }

    if (!editToken) {
      toast.error("رمز التعديل مفقود");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Add experience ID and edit token
    formData.append("experience_id", experience.id);
    formData.append("edit_token", editToken);

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value as any);
      }
    });

    try {
      const res = await updateExperience({}, formData);

      if (res?.message) {
        if (res.message.includes("❌")) {
          toast.error(res.message, { richColors: true });
        } else {
          toast.success(res.message, { richColors: true });
          router.push(`/experience/${experience.id}`);
        }
      } else {
        toast.error("حدث خطأ غير متوقع", { richColors: true });
      }
    } catch (err) {
      console.error(err);
      toast.error("تعذر تحديث التجربة" + err, { richColors: true });
    } finally {
      setLoading(false);
    }
  };

  if (!editToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-2xl font-bold">تعديل التجربة</CardTitle>
        <div className="flex justify-between w-full my-6 text-foreground/80">
          {formSteps.map((step, i) => (
            <div key={step.id} className="w-1/4 text-center">
              <div
                className={cn(
                  "h-1 w-full rounded-full",
                  currentStep >= i ? " bg-primary" : "bg-gray-200",
                )}
              />
              <span className="mt-1 text-xs block">{step.title}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <FormProvider {...methods}>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {currentStep === 0 && (
                <Step1 professions={professions} cities={cities} />
              )}
              {currentStep === 1 && <Step2 />}
              {currentStep === 2 && <Step3 />}
              {currentStep === 3 && <Step4 tags={tags} />}
            </CardContent>
            <CardFooter className="flex mt-8 justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={currentStep === 0}
                onClick={handlePrevStep}
              >
                العودة
              </Button>

              {isFinalStep ? (
                loading ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  <Button type="submit">حفظ التعديلات</Button>
                )
              ) : (
                <Button type="button" onClick={handleNextStep}>
                  التالي
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
