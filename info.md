
1. Combien y a t-il de choicesInteraction ?
2. Combien par groupe ?
3. Cela définit le nombre de traitement
    Par exemple 100 choicesInteraction - 3 items = I1 33, I2 33, I3 34

    Le response identifier doit correspondre entre le responseDeclaration et le gridRowChoice

    Je dois construire le responseDeclaration pour chacun des 3 items

    Puis je dois construire l'item Body pour chaque item en ajoutant le "GridRow Choice"

    Enfin de je dois construire le responseProcessing avec la même contraine Response_N

    Puis je dois ajouter dans un même fichier :

    HEADER + responseDeclaration + [outcomeDeclaration] + ItemBody + responseProcessing

