import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  Instagram,
  Linkedin,
  Play,
  Star,
  Stars,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Code, Palette, Users, Smartphone } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "No Coding Required",
    description:
      "Automatically convert your YouTube videos, playlists, and channel info into a dynamic website.",
  },
  {
    icon: Palette,
    title: "Customizable Design",
    description:
      "Choose from a variety of professionally designed themes that match your style.",
  },
  {
    icon: Users,
    title: "Built for Creators",
    description:
      "Seamlessly integrate your latest content, engage with your audience, and grow your brand.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description:
      "Your website will look great on any device—desktop, tablet, or mobile.",
  },
];

const plans = [
  {
    name: "Hobby",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "Basic website creation",
      "1 Project",
      "YouTube integration",
      "Mobile responsive design",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    description: "For serious creators",
    features: [
      "Everything in Hobby",
      "10 Projects",
      "Custom domain (soon)",
      "Priority support",
      "Custom themes (soon)",
      "SEO optimization (soon)",
    ],
    popular: true,
  },
];

const testimonials = [
  {
    name: "Sarah",
    role: "Content Creator",
    content:
      "YT Craft made it so easy to turn my YouTube channel into a beautiful website. I can now engage with my community beyond YouTube!",
    initials: "S",
  },
  {
    name: "James L.",
    role: "Entrepreneur",
    content:
      "As a business, I needed a way to present my content in a more professional way. YT Craft was the perfect solution.",
    initials: "JL",
  },
  {
    name: "Michael",
    role: "Creator",
    content:
      "The quality and attention to detail are truly impressive. Thank you for making me feel stylish!",
    initials: "M",
  },
  {
    name: "Alex T.",
    role: "Influencer",
    content:
      "I was amazed by how quickly my website was created. It's easy to update, and the design is perfect for my brand.",
    initials: "AT",
  },
];
export default function Home() {
  return (
    <div className="w-full xl:max-w-[80%] xl:mx-auto px-4 xl:px-0">
      <main className="w-full  mx-auto min-h-[calc(100vh_-_2rem)]">
        <div className="flex flex-col items-center justify-center w-full gap-8">
          {/* HERO SECTION */}
          <div className="min-h-[60vh] flex flex-col items-center justify-evenly w-full">
            <h3 className="lg:text-5xl text-2xl font-bold text-center tracking-tight  mt-10 leading-normal">
              Convert your Youtube Channel into <br />
              <span className="">Stunning Website!</span>
            </h3>
            <h5 className="text-center text-xl text-gray-600 dark:text-gray-300  ">
              Convert your YouTube channel into a fully customizable website
              <br /> in just a few clicks
            </h5>
            <div className=" flex gap-4 flex-wrap justify-center mb-10">
              <Link href="/signup" rel="noopener noreferrer">
                <Button className="py-6">
                  <Stars className="size-4 me-2" />
                  Get Started
                </Button>
              </Link>

              <Button variant={"outline"} className="py-6">
                <Play /> Watch DEMO
              </Button>
            </div>
          </div>

          {/* FEATURES SECTION */}
          <div className="flex flex-col gap-4 flex-wrap items-center mb-6">
            <h2 className="text-2xl md:text-4xl font-bold">
              Why Choose <span className="">YT Craft</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 ">
              Experience the future of content creation with our cutting-edge
              platform
            </p>
          </div>
          <div className="grid grid-col-1 xl:grid-cols-2 gap-4 flex-wrap items-center mb-10 w-full ">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="h-full w-full transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm
                dark:border-white border-2"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br rounded-full flex items-center justify-center border-3">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold ">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-200 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PRICING SECTION */}
          <section className="w-full">
            <div className="py-10" id="pricing">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:dark:text-gray-200  mb-6">
                  Simple <span className="">Pricing</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-200 ">
                  Choose the plan that&#39;s right for you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 border border-red gap-10 xl:max-w-[70%] mx-auto">
                {plans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`relative border-2 ${
                      plan.popular ? "shadow-2xl scale-105" : "border-gray-200"
                    }  transition-all duration-300`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-black via-zinc-500 to-black text-white px-6 py-2 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8">
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-200 ">
                        {plan.name}
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900 dark:text-gray-200 ">
                          {plan.price}
                        </span>
                        <span className="text-gray-500 dark:text-gray-300 ">
                          {plan.period}
                        </span>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-300  mt-2">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-200 ">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full py-6 text-lg font-semibold cursor-pointer"
                        //   className={`w-full py-6 text-lg font-semibold rounded-full transition-all duration-300 ${
                        //     plan.popular
                        //       ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        //       : ""
                        //   }`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.popular ? "Join Waitlist" : "Get Started"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="w-full">
            <div className="flex flex-col gap-4 flex-wrap items-center mb-6">
              <h2 className="text-2xl md:text-4xl font-bold">
                What Creators Says
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 ">
                Join thousands of satisfied creators
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 border border-red gap-10 mb-10">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm
                dark:border-white border-2"
                  //   className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
                >
                  <CardContent className="">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>

                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-6 text-lg italic">
                      &#34;{testimonial.content}&#34;
                    </p>

                    <div className="flex items-center">
                      <div className="h-12 w-12 mr-4 ">
                        <div className="bg-gradient-to-br rounded-full from-black via-zinc-500 to-black text-white font-semibold h-full w-full flex items-center justify-center">
                          {testimonial.initials}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-200">
                          {testimonial.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* MORE SECTION */}
          <section>
            <div className="flex flex-col gap-4 flex-wrap items-center mb-6">
              <h2 className="text-2xl md:text-4xl font-bold">
                Ready to Transform Your Channel?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 ">
                Join thousands of creators who have already transformed their
                YouTube channels into stunning websites.
              </p>
              <Link href="/signup" rel="noopener noreferrer">
                <Button className="py-6">
                  <Stars className="size-4 me-2" />
                  Get Started Today
                </Button>
              </Link>
            </div>
          </section>

          {/* FOOTER */}
          <footer
            className=" border-t-2 border-zinc-400 pt-8 pb-16 px-4 w-full"
            id="contact"
          >
            <div className="">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h4 className="text-2xl font-bold">YT Craft</h4>
                  <p className="text-gray-400 mt-2">
                    © 2025 YT Craft. All rights reserved.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:text-black hover:scale-105 dark:hover:text-white"
                  >
                    <Youtube className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:text-black hover:scale-105 dark:hover:text-white"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:text-black hover:scale-105 dark:hover:text-white"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:text-black hover:scale-105 dark:hover:text-white"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
