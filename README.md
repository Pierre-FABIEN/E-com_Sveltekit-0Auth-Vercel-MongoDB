> The example repository is maintained from a [monorepo](https://github.com/nextauthjs/next-auth/tree/main/apps/examples/sveltekit). Pull Requests should be opened against [`nextauthjs/next-auth`](https://github.com/nextauthjs/next-auth).

<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank">
   <img height="64" src="https://authjs.dev/img/logo-sm.png" />
   </a>
   <a href="https://kit.svelte.dev" target="_blank">
   <img height="64" src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg" />
   </a>
   <h3 align="center"><b>SvelteKit Auth</b> - Example App</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <a href="https://npm.im/@auth/sveltekit">
        <img alt="npm" src="https://img.shields.io/npm/v/@auth/sveltekit?color=green&label=@auth/sveltekit&style=flat-square">
      </a>
      <a href="https://bundlephobia.com/result?p=@auth/sveltekit">
        <img src="https://img.shields.io/bundlephobia/minzip/@auth/sveltekit?label=size&style=flat-square" alt="Bundle Size"/>
      </a>
      <a href="https://www.npmtrends.com/@auth/sveltekit">
        <img src="https://img.shields.io/npm/dm/@auth/sveltekit?label=downloads&style=flat-square" alt="Downloads" />
      </a>
      <a href="https://npm.im/@auth/sveltekit">
        <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
      </a>
   </p>
</p>

## Overview

This is the official SvelteKit Auth example for [Auth.js](https://sveltekit.authjs.dev).

## Getting started

You can instantly deploy this example to [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=sveltekit-auth-example) by clicking the following button.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/nextauthjs/sveltekit-auth-example&project-name=sveltekit-auth-example&repository-name=sveltekit-auth-example)




faire le admin ventes
gestion des utilisateurs
sur le dashboard montrer les dernières ventes et tout

faire attention a ce que pour le order il y est bien une adresse associée (une commande ne peut pas passer sans adresse)
faire attention quand une commande passe enlever les unité dans les stock
Faire une page destinée au panier pour mettre tout au clair et passer au paiement

gerer les stripe
revoir la sécurité sur les données
commencer le blog

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