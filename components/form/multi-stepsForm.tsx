"use client";

import { useState } from "react";
import {
  useForm,
  useFormContext,
  FormProvider,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { createExperience } from "@/app/lib/actions";
import { fetchProfessions } from "@/app/lib/data";

// ---------------- Zod Schemas ----------------
const step1Schema = z.object({
  profession_id: z.number().min(1, "الرجاء اختيار التخصص"),
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
});

const step4Schema = z.object({
  positives: z.string().min(3, "الإيجابيات يجب أن تكون 3 أحرف على الأقل"),
  negatives: z.string().min(3, "السلبيات يجب أن تكون 3 أحرف على الأقل"),
  tags: z.array(z.string()).optional(),
  rating: z.number().min(1, "التقييم مطلوب").max(5),
});

const formSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

// ---------------- Fake Data ----------------

const allTags = [
  { id: "1", name: "عمل جماعي" },
  { id: "2", name: "بيئة داعمة" },
  { id: "3", name: "ضغط عمل عالٍ" },
  { id: "4", name: "فرص للتعلم" },
];

const ratings = [
  { value: "1", label: "⭐" },
  { value: "2", label: "⭐⭐" },
  { value: "3", label: "⭐⭐⭐" },
  { value: "4", label: "⭐⭐⭐⭐" },
  { value: "5", label: "⭐⭐⭐⭐⭐" },
];
const tagOptions = [
  "تنظيم ممتاز",
  "ضغط عالي",
  "تعليمي",
  "دوام مرن",
  "قلة ترتيب",
  "فرص تدريب",
];

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

// ---------------- Step Components ----------------
const Step1 = ({ professions }: { professions: any[] }) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Profession */}
      <FormField
        control={control}
        name="profession_id"
        render={({ field }) => (
          <FormItem dir="rtl" className="w-full">
            <FormLabel>التخصص</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between ",
                      !field.value && "text-muted-foreground"
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
                  <CommandGroup>
                    {professions.map((p) => (
                      <CommandItem
                        key={p.id}
                        value={p.id}
                        onSelect={() => {
                          field.onChange(p.id);
                          setOpen(false);
                        }}
                      >
                        {p.name}
                        <Check
                          className={cn(
                            "mr-auto h-4 w-4 rtl:ml-auto rtl:mr-0",
                            field.value === p.id ? "opacity-100" : "opacity-0"
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

// Step2
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
                      !field.value && "text-muted-foreground"
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
                          .padStart(2, "0")}`
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
              <Input
                placeholder="تجربتك كانت روتيشن اول او ثاني  "
                {...field}
              />
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

// Step3
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
                className="min-h-40"
                placeholder="تحدث عن تجربتك بالتفصيل: 
                هل يتم تحديد أخصائي لكل طالب؟
هل تمسك مرضى لحالك؟
كيف تعامل الأخصائيين؟
هل البيئة تعليمية؟
هل فيه متطلبات (برزنتيشن/بحث)؟
هل يعتبرون دقيقين في اوقات الدوام والغياب؟
أنواع الحالات اللي تشوفها؟ وكيف الغياب وإجراءاته ؟
والمواقف والمطاعم؟
                "
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
    </>
  );
};

// Step4
const Step4 = ({ tags }: { tags: string[] }) => {
  const { control, setValue, watch } = useFormContext();

  const currentTags = watch("tags"); // Watch the tags array for real-time updates

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
      {/* Rating */}
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
      {/* Tags */}
      <FormField
        control={control}
        name="tags" // Keep the name for validation
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
                        // Use setValue to remove the tag
                        setValue(
                          "tags",
                          currentTags.filter((t: string) => t !== tag),
                          { shouldDirty: true, shouldValidate: true }
                        );
                      } else {
                        // Use setValue to add the tag
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
    </>
  );
};

// Steps setup
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

// ---------------- Main Form ----------------
type ExperienceFormValues = z.infer<typeof formSchema>;

export default function ExperienceForm({
  professions,
  tags,
}: {
  professions: any[];
  tags: string[];
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<ExperienceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profession_id: 0,
      year: "",
      place: "",
      rotation: "",
      working_hours: "",
      description: "",
      positives: "",
      negatives: "",
      departments: "",
      requirements: "",
      rating: 0,
      tags: [] as string[],
    },
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const { trigger, handleSubmit } = methods;
  const CurrentComponent = formSteps[currentStep].component;
  const isFinalStep = currentStep === formSteps.length - 1;

  const handleNextStep = async () => {
    const isStepValid = await trigger(
      Object.keys(
        formSteps[currentStep].schema.shape
      ) as (keyof ExperienceFormValues)[]
    );
    if (isStepValid) setCurrentStep((s) => s + 1);
  };

  const handlePrevStep = () => setCurrentStep((s) => s - 1);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value as any);
      }
    });

    await createExperience({}, formData);
    setLoading(false);
  };

  return (
    <main
      dir="rtl"
      className="w-full mt-11 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl  ">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-2xl font-bold">
            {" "}
            أضف تجربتك في الامتياز
          </CardTitle>
          <div className="flex justify-between w-full my-6 text-foreground/80">
            {formSteps.map((step, i) => (
              <div key={step.id} className="w-1/4 text-center">
                <div
                  className={cn(
                    "h-1 w-full rounded-full",
                    currentStep >= i ? " bg-primary" : "bg-gray-200"
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
                {/* Conditionally render the step component */}
                {currentStep === 0 && <Step1 professions={professions} />}
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
                    <Button type="submit">إرسال</Button>
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
    </main>
  );
}
