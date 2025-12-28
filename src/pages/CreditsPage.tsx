
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Award, Dumbbell, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreditsPage = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto space-y-8">

                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                            Mente e Cuore di GymConnect AI
                        </h1>
                        <p className="text-xl text-gray-600">
                            L'idea, la visione e la realizzazione nascono da un'unica passione.
                        </p>
                    </div>

                    <Card className="overflow-hidden border-2 border-green-100 shadow-xl">
                        <div className="bg-gradient-to-r from-green-600 to-blue-600 h-32 relative">
                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-lg overflow-hidden">
                                    <span className="text-4xl font-bold text-slate-300">MS</span>
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-20 pb-8 px-8 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Massimiliano Sabato</h2>
                            <p className="text-blue-600 font-medium mb-6">Ideatore & Founder</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Formazione</h3>
                                        <p className="text-sm text-gray-600">Laurea in Gestione e Management Sportivo</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Esperienza Digitale</h3>
                                        <p className="text-sm text-gray-600">Esperto in Digital Marketing & IT PA</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                        <Dumbbell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Background Fitness</h3>
                                        <p className="text-sm text-gray-600">Ex Formatore Fitness & Docente Scienze Motorie</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Management</h3>
                                        <p className="text-sm text-gray-600">Direzione Tecnica di 3 Centri Fitness</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-8">
                                <h3 className="text-lg font-semibold mb-4">Contatti Diretti</h3>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <Button variant="outline" className="gap-2" onClick={() => window.location.href = 'mailto:massimilianosabato@hotmail.com'}>
                                        <Mail className="w-4 h-4" />
                                        massimilianosabato@hotmail.com
                                    </Button>
                                    <Button variant="outline" className="gap-2" onClick={() => window.open('https://wa.me/393295644852', '_blank')}>
                                        <Phone className="w-4 h-4" />
                                        +39 329 564 4852 (WhatsApp)
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </Layout>
    );
};

export default CreditsPage;
