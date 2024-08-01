## Overview

This is the official SvelteKit Auth example for [Auth.js](https://sveltekit.authjs.dev).

## Getting started

You can instantly deploy this example to [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=sveltekit-auth-example) by clicking the following button.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/nextauthjs/sveltekit-auth-example&project-name=sveltekit-auth-example&repository-name=sveltekit-auth-example)

Cartes de test Stripe
Paiements réussis
Carte de crédit classique :
Numéro de carte : 4242 4242 4242 4242
Date d'expiration : N'importe quelle date future (par exemple, 12/34)
CVC : N'importe quel nombre à 3 chiffres (par exemple, 123)
Paiements échoués
Carte de crédit déclinée :
Numéro de carte : 4000 0000 0000 9995
Date d'expiration : N'importe quelle date future
CVC : N'importe quel nombre à 3 chiffres
Adresses et autres informations
Vous pouvez entrer n'importe quelle adresse et information personnelle, car ces données ne sont pas vérifiées en mode test.

Étapes à suivre
Entrez les informations de test sur la page de paiement :

Utilisez une des cartes de test fournies ci-dessus.
Finalisez le paiement :

Cliquez sur le bouton pour soumettre le paiement.
Exemple de cartes de test supplémentaires
Carte avec authentication 3D Secure :

Numéro de carte : 4000 0027 6000 3184
Date d'expiration : N'importe quelle date future
CVC : N'importe quel nombre à 3 chiffres
Carte avec échec de 3D Secure :

Numéro de carte : 4000 0027 6000 3246
Date d'expiration : N'importe quelle date future
CVC : N'importe quel nombre à 3 chiffres

stripe listen --forward-to localhost:1000/api/webhooks


Réaliser les stat sur la consultation
Performances sur le server pour cache
commencer le blog et TinyMCE


revoir la sécurité sur les données
