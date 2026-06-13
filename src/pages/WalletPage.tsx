import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from '@/hooks/useWallet';
import { Loader2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';

const WalletPage = () => {
    const { wallet, transactions, loading } = useWallet();
    const { t, language } = useLanguage();
    const { brandName } = useBranding();

    const dateLocale = language === 'IT' ? it : enUS;

    if (loading && !wallet) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">{t('wallet.title')}</h1>

            {/* Balance Card */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border-slate-700/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300 uppercase tracking-wider">
                            {t('wallet.balance_available')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-5xl font-bold text-white">{wallet?.balance || 0}</span>
                            <span className="text-xl text-slate-400 font-semibold">FC</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            {t('wallet.balance_subtitle')}
                        </p>
                    </CardContent>
                </Card>

                {/* Account Status Card */}
                <Card className="border-slate-200/80 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                            {t('wallet.account_status')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center h-[120px]">
                        <div className="flex items-center space-x-3 text-emerald-600 mb-2">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-semibold">{t('wallet.account_active')}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {t('wallet.account_desc')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions History */}
            <Card className="border-slate-200/80 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t('wallet.history')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {transactions.length === 0 ? (
                            <p className="text-center text-slate-400 py-8 text-sm">{t('wallet.no_transactions')}</p>
                        ) : (
                            transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-2 rounded-full ${tx.amount >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            {tx.amount >= 0 ? (
                                                <TrendingUp className="w-5 h-5" />
                                            ) : (
                                                <TrendingDown className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{tx.description || t('wallet.transaction')}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {format(new Date(tx.created_at), "d MMMM yyyy, HH:mm", { locale: dateLocale })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`font-bold text-lg ${tx.amount >= 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount} FC
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Top-Up Section */}
            <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-800">{t('wallet.topup_title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Starter */}
                <Card className="hover:shadow-xl transition-all border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-slate-700 font-semibold">Starter</CardTitle>
                        <div className="text-3xl font-bold text-slate-900 mt-2">25€</div>
                        <p className="text-xs text-slate-400 mt-1">{t('wallet.starter_desc')}</p>
                    </CardHeader>
                    <CardContent className="text-center pt-2">
                        <div className="text-3xl font-extrabold text-indigo-600 mb-4">25 FC</div>
                        <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-400 border-0 active:scale-95 transition-transform" disabled>
                            {t('wallet.buy')}
                        </Button>
                    </CardContent>
                </Card>

                {/* Active - Adidas Promo */}
                <Card className="hover:shadow-xl transition-all border-indigo-200 bg-indigo-50/10 relative overflow-hidden flex flex-col justify-between shadow-sm">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] px-2.5 py-0.5 rounded-bl font-semibold uppercase tracking-wider">
                        {t('wallet.best_value')}
                    </div>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-indigo-700 font-bold">Active</CardTitle>
                        <div className="text-3xl font-bold text-slate-900 mt-2">50€</div>
                        <p className="text-xs text-indigo-600 font-semibold mt-1">{t('wallet.active_bonus')}</p>
                    </CardHeader>
                    <CardContent className="text-center pt-2">
                        <div className="text-3xl font-extrabold text-indigo-600 mb-2">55 FC</div>
                        <div className="bg-white p-2 rounded border border-indigo-100 mb-4 shadow-sm">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('wallet.partner_reward')}</p>
                          <div className="flex items-center justify-center gap-1.5 mt-1">
                            <span className="font-black text-slate-800 tracking-tighter text-lg">adidas</span>
                            <span className="text-xs bg-slate-950 text-white px-1.5 py-0.5 rounded-md font-bold">-10%</span>
                          </div>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0 active:scale-95 transition-transform shadow-md shadow-indigo-200">
                            {t('wallet.buy')}
                        </Button>
                    </CardContent>
                </Card>

                {/* Pro - MyProtein Promo */}
                <Card className="hover:shadow-xl transition-all border-indigo-200 bg-indigo-50/10 flex flex-col justify-between shadow-sm">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-indigo-700 font-bold">Pro</CardTitle>
                        <div className="text-3xl font-bold text-slate-900 mt-2">100€</div>
                        <p className="text-xs text-indigo-600 font-semibold mt-1">{t('wallet.pro_bonus')}</p>
                    </CardHeader>
                    <CardContent className="text-center pt-2">
                        <div className="text-3xl font-extrabold text-indigo-600 mb-2">115 FC</div>
                        <div className="bg-white p-2 rounded border border-indigo-100 mb-4 shadow-sm">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('wallet.partner_reward')}</p>
                          <div className="flex items-center justify-center gap-1 mt-1 text-xs font-bold text-slate-700">
                            MyProtein <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">€25 Gift</span>
                          </div>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0 active:scale-95 transition-transform shadow-md shadow-indigo-200">
                            {t('wallet.buy')}
                        </Button>
                    </CardContent>
                </Card>

                {/* Elite - Gym Kit */}
                <Card className="hover:shadow-xl transition-all border-amber-200 bg-amber-50/10 flex flex-col justify-between shadow-sm">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-amber-700 font-bold">Elite</CardTitle>
                        <div className="text-3xl font-bold text-slate-900 mt-2">250€</div>
                        <p className="text-xs text-amber-600 font-semibold mt-1">{t('wallet.elite_bonus')}</p>
                    </CardHeader>
                    <CardContent className="text-center pt-2">
                        <div className="text-3xl font-extrabold text-amber-600 mb-2">300 FC</div>
                        <div className="bg-white p-2 rounded border border-amber-100 mb-4 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('wallet.vip_reward')}</p>
                            <p className="text-xs font-bold text-slate-700 pt-1">📦 {t('wallet.welcome_kit_reward').replace('{brandName}', brandName)}</p>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 active:scale-95 transition-transform shadow-md shadow-amber-200">
                            {t('wallet.elite_btn')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WalletPage;
