import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, Cookie, Settings, X } from "lucide-react";
import { Link } from "wouter";

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CONSENT_KEY = "russian_mastery_gdpr_consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if consent was already given
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (!savedConsent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: ConsentPreferences) => {
    const consentData = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    setShowBanner(false);
  };

  const acceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(necessaryOnly);
    saveConsent(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
      >
        <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-xl border-primary/30 shadow-2xl">
          <CardContent className="p-6">
            {!showDetails ? (
              /* Main Banner */
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                    🔒 Protection de Vos Données (RGPD)
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience d'apprentissage du russe. 
                    Conformément au RGPD, vous pouvez choisir quels cookies accepter.{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Politique de confidentialité
                    </Link>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                    className="border-primary/50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Personnaliser
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={acceptNecessary}
                  >
                    Essentiels uniquement
                  </Button>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Tout accepter
                  </Button>
                </div>
              </div>
            ) : (
              /* Detailed Preferences */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Préférences des Cookies
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetails(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Necessary Cookies */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div>
                      <h4 className="font-medium text-foreground">🔐 Cookies Essentiels</h4>
                      <p className="text-sm text-muted-foreground">
                        Nécessaires au fonctionnement du site (authentification, sécurité)
                      </p>
                    </div>
                    <Switch checked={true} disabled />
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div>
                      <h4 className="font-medium text-foreground">📊 Cookies Analytiques</h4>
                      <p className="text-sm text-muted-foreground">
                        Nous aident à comprendre comment vous utilisez le site
                      </p>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, analytics: checked }))
                      }
                    />
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div>
                      <h4 className="font-medium text-foreground">📢 Cookies Marketing</h4>
                      <p className="text-sm text-muted-foreground">
                        Utilisés pour personnaliser les publicités
                      </p>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, marketing: checked }))
                      }
                    />
                  </div>

                  {/* Preference Cookies */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div>
                      <h4 className="font-medium text-foreground">⚙️ Cookies de Préférences</h4>
                      <p className="text-sm text-muted-foreground">
                        Mémorisent vos paramètres (langue, thème, niveau)
                      </p>
                    </div>
                    <Switch
                      checked={preferences.preferences}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, preferences: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={acceptNecessary}>
                    Refuser tout
                  </Button>
                  <Button
                    onClick={saveCustomPreferences}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Sauvegarder mes préférences
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default CookieConsent;
