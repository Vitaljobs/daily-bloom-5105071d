import { motion } from "framer-motion";
import { Coffee, Users, Heart, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-5 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 hover:bg-white/5"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Terug
                </Button>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                            Over CommonGround
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Waar ambitie en ontspanning samenkomen in de perfecte balans.
                        </p>
                    </motion.div>

                    {/* Mission Card */}
                    <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 shadow-xl">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20">
                                <Coffee className="w-8 h-8 text-amber-500" />
                            </div>
                            <div className="space-y-4 text-center md:text-left">
                                <h3 className="text-2xl font-semibold text-foreground">Onze Missie</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    CommonGround is meer dan alleen een werkplek. Het is een levend ecosysteem voor creatieven, denkers en doeners. Wij geloven dat de beste ideeën ontstaan in een omgeving die rust uitstraalt, maar tegelijkertijd bruist van de energie.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Users, title: "Community", desc: "Verbind met gelijkgestemden in een sfeer van vertrouwen." },
                            { icon: Heart, title: "Welzijn", desc: "Focus op mentale gezondheid en balans in je werkdag." },
                            { icon: Star, title: "Excellence", desc: "Premium faciliteiten voor topprestaties." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="p-6 rounded-xl bg-card/30 border border-white/5 hover:bg-card/40 transition-colors"
                            >
                                <item.icon className="w-6 h-6 text-amber-400 mb-4" />
                                <h4 className="text-lg font-medium mb-2">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Story Section */}
                    <motion.div variants={itemVariants} className="space-y-6 text-center md:text-left">
                        <h3 className="text-2xl font-serif font-semibold text-center">Het Verhaal</h3>
                        <p className="text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
                            Begonnen als een droom om de traditionele kantoorcultuur te doorbreken, is CommonGround uitgegroeid tot een toevluchtsoord voor professionals die geloven in "het nieuwe werken". Geen systeemplafonds en TL-buizen, maar natuurlijk licht, verse koffiebonen en inspirerende gesprekken.
                        </p>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};

export default About;
