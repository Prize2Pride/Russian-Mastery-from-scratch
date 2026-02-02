import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, ArrowLeft, Shield, Lock, Eye, Trash2, Download, Mail } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold gold-text">Russian Mastery</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-green-400 text-sm font-medium">RGPD Conforme</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Omega Protocol Activé</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
              <span className="gold-text">Politique de Confidentialité</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Dernière mise à jour: 2 Février 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Chez <strong className="text-primary">Russian Mastery</strong>, propulsé par <strong className="text-primary">Prize2Pride</strong>, 
                  nous prenons la protection de vos données personnelles très au sérieux. Cette politique de confidentialité 
                  explique comment nous collectons, utilisons, stockons et protégeons vos informations conformément au 
                  Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne.
                </p>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-primary" />
                  Données Collectées
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">Nous collectons les types de données suivants:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Données d'identification:</strong> Nom, adresse email (via OAuth)</li>
                    <li><strong className="text-foreground">Données d'apprentissage:</strong> Progression des leçons, scores, niveau CECR</li>
                    <li><strong className="text-foreground">Données de conversation:</strong> Messages du chat tuteur (pour améliorer l'expérience)</li>
                    <li><strong className="text-foreground">Données techniques:</strong> Adresse IP, type de navigateur, cookies</li>
                    <li><strong className="text-foreground">Contenu généré:</strong> Chansons créées, exercices complétés</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Purpose */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">🎯 Finalités du Traitement</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <h3 className="font-bold text-foreground mb-2">Apprentissage Personnalisé</h3>
                    <p className="text-sm text-muted-foreground">Adapter les leçons à votre niveau et progression</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <h3 className="font-bold text-foreground mb-2">Amélioration du Service</h3>
                    <p className="text-sm text-muted-foreground">Analyser l'utilisation pour améliorer la plateforme</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <h3 className="font-bold text-foreground mb-2">Communication</h3>
                    <p className="text-sm text-muted-foreground">Vous informer des mises à jour et nouvelles fonctionnalités</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <h3 className="font-bold text-foreground mb-2">Sécurité</h3>
                    <p className="text-sm text-muted-foreground">Protéger votre compte et détecter les fraudes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  👤 Vos Droits RGPD
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Droit d'Accès</h3>
                      <p className="text-sm text-muted-foreground">Consulter toutes vos données personnelles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Droit à la Portabilité</h3>
                      <p className="text-sm text-muted-foreground">Exporter vos données dans un format standard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Droit à l'Effacement</h3>
                      <p className="text-sm text-muted-foreground">Supprimer définitivement votre compte et données</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Droit de Rectification</h3>
                      <p className="text-sm text-muted-foreground">Corriger vos informations personnelles</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  🔒 Sécurité des Données
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Chiffrement SSL/TLS pour toutes les communications</li>
                  <li>Authentification sécurisée via OAuth 2.0</li>
                  <li>Stockage sécurisé des données avec chiffrement au repos</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Audits de sécurité réguliers</li>
                  <li>Protection contre les attaques XSS, CSRF et injection SQL</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">⏱️ Conservation des Données</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Nous conservons vos données personnelles uniquement pendant la durée nécessaire:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Données de compte:</strong> Jusqu'à suppression du compte</li>
                    <li><strong className="text-foreground">Données d'apprentissage:</strong> 3 ans après la dernière activité</li>
                    <li><strong className="text-foreground">Logs de sécurité:</strong> 12 mois</li>
                    <li><strong className="text-foreground">Cookies:</strong> Selon vos préférences (max 13 mois)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-500/30">
              <CardContent className="p-8 text-center">
                <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Nous Contacter</h2>
                <p className="text-muted-foreground mb-6">
                  Pour toute question concernant vos données personnelles ou pour exercer vos droits:
                </p>
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:privacy@prize2pride.com" className="hover:underline">
                    privacy@prize2pride.com
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Responsable du traitement: <strong className="text-primary">Raoued Fadhel</strong> - Prize2Pride
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'Accueil
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-background/50 backdrop-blur-xl mt-12">
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">
            © 2026 Russian Mastery par <span className="gold-text font-bold">Raoued Fadhel</span> - Prize2Pride Ultimate
          </p>
        </div>
      </footer>
    </div>
  );
}
