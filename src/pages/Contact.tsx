import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Bericht verzonden! We nemen spoedig contact op.");
            setIsSubmitting(false);
            navigate("/");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-background to-background pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 hover:bg-white/5"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Terug
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Info Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div>
                            <h1 className="text-4xl font-serif font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                Contact
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Vragen over memberships, events of gewoon even hallo zeggen? We horen graag van je.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: MapPin, label: "Locatie", value: "MindGarden Hub, Amsterdam" },
                                { icon: Mail, label: "Email", value: "hello@mindgarden.nl" },
                                { icon: Phone, label: "Telefoon", value: "+31 (0) 20 123 4567" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <item.icon className="w-5 h-5 text-amber-400" />
                                    <div>
                                        <div className="text-sm text-muted-foreground">{item.label}</div>
                                        <div className="font-medium">{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-white/5">
                            <h4 className="font-medium mb-2">Openingstijden</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Maandag - Vrijdag</span>
                                    <span className="text-foreground">08:00 - 20:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Zaterdag</span>
                                    <span className="text-foreground">10:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Zondag</span>
                                    <span className="text-foreground">Gesloten</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-3xl bg-card border border-white/10 shadow-2xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Naam</label>
                                <Input placeholder="Je naam" required className="bg-background/50" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Email</label>
                                <Input type="email" placeholder="naam@voorbeeld.nl" required className="bg-background/50" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Bericht</label>
                                <Textarea placeholder="Waar kunnen we je mee helpen?" required className="min-h-[120px] bg-background/50" />
                            </div>

                            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold" disabled={isSubmitting}>
                                {isSubmitting ? "Verzenden..." : (
                                    <>Verstuur Bericht <Send className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
