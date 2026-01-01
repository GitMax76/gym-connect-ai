import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from '@/hooks/useWallet';
import { Loader2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Button } from "@/components/ui/button";

const WalletPage = () => {
    const { wallet, transactions, loading } = useWallet();

    if (loading && !wallet) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Il mio Portafoglio</h1>

            {/* Balance Card */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300 uppercase tracking-wider">
                            Saldo Disponibile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-5xl font-bold">{wallet?.balance || 0}</span>
                            <span className="text-xl text-slate-400">FC</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            FitCoin utilizzabili per prenotazioni
                        </p>
                    </CardContent>
                </Card>

                {/* Quick Stats or Actions (Placeholder) */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            Stato Account
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center h-[120px]">
                        <div className="flex items-center space-x-3 text-green-600 mb-2">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-medium">Account Attivo</span>
                        </div>
                        <p className="text-sm text-slate-600">
                            Usa i tuoi crediti per prenotare sessioni con i migliori trainer.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions History */}
            <Card>
                <CardHeader>
                    <CardTitle>Cronologia Transazioni</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">Nessuna transazione recente.</p>
                        ) : (
                            transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-2 rounded-full ${tx.amount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {tx.amount >= 0 ? (
                                                <TrendingUp className={`w-5 h-5 ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                                            ) : (
                                                <TrendingDown className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{tx.description || 'Transazione'}</p>
                                            <p className="text-xs text-slate-500 capitalize">
                                                {format(new Date(tx.created_at), "d MMMM yyyy, HH:mm", { locale: it })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-slate-900'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount} FC
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Top-Up Section */}
            <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-800">Ricarica FitCoin</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Starter */}
                <Card className="hover:shadow-xl transition-all border-slate-200">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-slate-700">Starter</CardTitle>
                        <div className="text-3xl font-bold text-slate-900 mt-2">25€</div>
                        <p className="text-sm text-slate-500">per iniziare</p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-4">25 FC</div>
                        <Button className="w-full bg-slate-900 hover:bg-slate-800" disabled>
                            Acquista
                        </Button>
                    </CardContent>
                </Card>

                {/* Active - Adidas Promo */}
                <Card className="hover:shadow-xl transition-all border-blue-200 bg-blue-50/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl">Best Value</div>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-blue-700">Active</CardTitle>
                        <div className="text-3xl font-bold text-slate-900 mt-2">50€</div>
                        <p className="text-sm text-blue-600 font-medium">+10% Bonus</p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">55 FC</div>
                        <div className="bg-white p-2 rounded border border-blue-100 mb-4 shadow-sm">
                            <p className="text-xs font-bold text-slate-600 uppercase">Partner Reward</p>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <span className="font-bold text-xl">adidas</span>
                                <span className="text-sm bg-black text-white px-1 rounded">-10%</span>
                            </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Acquista
                        </Button>
                    </CardContent>
                </Card>

                {/* Pro - MyProtein Promo */}
                <Card className="hover:shadow-xl transition-all border-indigo-200 bg-indigo-50/50">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-indigo-700">Pro</CardTitle>
                        <div className="text-3xl font-bold text-slate-900 mt-2">100€</div>
                        <p className="text-sm text-indigo-600 font-medium">+15% Bonus</p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-4xl font-bold text-indigo-600 mb-2">115 FC</div>
                        <div className="bg-white p-2 rounded border border-indigo-100 mb-4 shadow-sm">
                            <p className="text-xs font-bold text-slate-600 uppercase">Partner Reward</p>
                            <div className="flex items-center justify-center gap-2 mt-1 text-sm font-medium">
                                MyProtein <span className="bg-indigo-600 text-white px-1 rounded">25€ Gift</span>
                            </div>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Acquista
                        </Button>
                    </CardContent>
                </Card>

                {/* Elite - Gym Kit */}
                <Card className="hover:shadow-xl transition-all border-amber-200 bg-amber-50/50">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-amber-700">Elite</CardTitle>
                        <div className="text-3xl font-bold text-slate-900 mt-2">250€</div>
                        <p className="text-sm text-amber-600 font-medium">+20% Bonus</p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-4xl font-bold text-amber-600 mb-2">300 FC</div>
                        <div className="bg-white p-2 rounded border border-amber-100 mb-4 shadow-sm">
                            <p className="text-xs font-bold text-slate-600 uppercase">VIP Reward</p>
                            <p className="text-sm font-medium pt-1">📦 Kit Benvenuto Gym Connect</p>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                            Diventa Elite
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WalletPage;
