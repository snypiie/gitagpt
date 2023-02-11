import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { languageType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import logo from './gita-gpt.svg';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [Gita, setGita] = useState("");
  const [language, setLanguage] = useState<languageType>("Professional");
  const [generatedGitas, setGeneratedGitas] = useState<String>("");
  const [errorMessage, setErrorMessage] = useState<String>("")

  console.log("Streamed response: ", generatedGitas);  
  const prompt =
  language === "Funny"
   ? `I want you to act as a Lord Krishna. I will type question and you will reply from Bhagavad Gita. Make sure each generated bio is at max 20 words and base it on this context: ${language}`
   : `Generate ${Gita} answers from Bhagavad Gita. Make sure each generated verse labeled by is atleast 30 words and at max 40 words and clearly labeled "1." and "2.". Make sure each generated bio is at least 14 words and at max 20 words and base them on this context: `
;

  const generateGita = async (e: any) => {
    e.preventDefault();
    setGeneratedGitas("");
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      console.log("Edge function returned.");
      
      if (!response.ok) {
        // throw new Error(response.statusText);
        setErrorMessage(`${response.statusText}. Please try again later.` || "Something went wrong. Please try again later.")
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setGeneratedGitas((prev) => prev + chunkValue);
      }
    } catch(e) {
      console.log(e)
      // console.log("e.message", e.message)
      setErrorMessage("Something went wrong. Please try again later.")
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="flex mx-auto flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Gita GPT – Bhagavad Geeta AI 🔥</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="max-w-5xl innerbox flex flex-1 w-full flex-col items-center justify-center text-center p-4">
        <h2 className="sm:text-2xl text-xl max-w-6xl font-light text-slate-700 pt-5 pt-4 py-4">
        Unlock the Power of AI with the Bhagavad Gita
        </h2>
        <div className="max-xl w-full">
          <div className="mt-10 items-center space-x-3">
            <p className="text-center font-medium text-slate-700 mt-5 mb-5">2.71,108+ Updesh generated</p>
            <strong className="text-center font-medium">
              🦚 Shri Krishna, Radhe Radhe 🦚</strong>
          </div>
          <textarea
            value={Gita}
            onChange={(e) => setGita(e.target.value)}
            rows={4}
            className="w-full rounded-md border-0 focus:border-red focus:ring-red mt-5 bg-gray-100 border-0"
            placeholder={
              "How can I find inner peace?"
            }
            />
          {/* Display error message below */}
          {errorMessage && (
            <p className="text-center font-medium text-red-500 mt-5 mb-5">{errorMessage}</p>
          )}
          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium text-xl px-4 py-2 sm:mt-4 mt-5 hover:bg-black/80 w-full"
              onClick={(e) => generateGita(e)}
            >
              Ask GitaGPT &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        {/* No need to show the response if there is any error */}
        {!errorMessage && (
          <ResizablePanel>
            <AnimatePresence mode="wait">
              <motion.div className="text-left space-y-10 my-10">
                {generatedGitas && (
                  <>
                    <div>
                      <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                        Bhagavad Geeta say:
                      </h2>
                    </div>
                    <div className="space-y-8 flex flex-col max-xl mx-auto">
                      {generatedGitas
                        .substring(generatedGitas.indexOf("1") + 3)
                        .split("2.")
                        .map((generatedGita) => {
                          return (
                            <div
                              className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedGita);
                                toast("Copied to clipboard", {
                                  icon: "✂️",
                                });
                              }}
                              key={generatedGita}
                            >
                              <p className="font-normal	">{generatedGita} - Krishna</p>
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </ResizablePanel>
        )}
        <a className="flex max-w items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mt-5 mb-5" href="https://www.sahu4you.com/gita-gpt/" target="_blank" rel="noopener noreferrer"><p>Support this project? then Show with ❤️</p></a>
        <p className="text-left mt-6 mb-6 space-y-4 leading-7 text-slate-700 sm:text-xl">We are trying to get this project live, please show love on twitter (@Gita_GPT) by sharing a tweet with screenshot.</p>
        <div className="max-xl w-full whitespace-pre-line break-words rounded-xl bg-white p-8 ring-1 ring-slate-900/5">
<h2 className="text-left mt-6 mb-6 space-y-4 leading-7 text-slate-700 sm:text-xl">Bhagavad Gita holds the key to unlocking answers to every query and challenges.</h2>
<ul className="list-disc text-left text-gray-900 my-5">
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Young, can turn guidance on how to live life.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Old, can seek wisdom on how to know how to die.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Ignorant, can find enlightenment and become wise.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Learned, can cultivate humility.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Rich, can learn compassion.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Dreamer, can find enchantment.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Practical, can gain counsel.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Weak, can find strength.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Strength, can receive direction.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Humble, can find exaltation.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Weary, can find rest.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Troubled, can find peace.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Doubting, can receive assurance.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Sinner, can find salvation.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Seeker, can achieve Moksha.</li>
<li className="mx-4 mr-2 shrink-0 rounded-full px-4 py-1 text-sm">The Human, can find guidance.</li></ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
