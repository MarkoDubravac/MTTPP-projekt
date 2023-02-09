# MTTPP-projekt

## Opis-projekta

Za projekt je testirana stranica: https://demoqa.com/, specifično funkcionalnosti book store demo stanice: https://demoqa.com/books. Stranica je javna i namjenjena za testiranje. <br/>
Book store demo stranica ima karakteristike koje su vrijedne testiranja kao što su registracija i login.

## Korišteni-alati

Apache JMeter - alat za automatizirano testiranje, pomoću kojega su izvršeni testovi i postavljeni uvjete testiranja (thread group svojstva i duration assertion), također je korišten za analizu testova (listener elementima, View Results Tree, Graph Results i Aggregation Report) i za generiranje konačnog izvješća. <br/>
BlazeMeter - ekstenzija za Chrome Browser koja omogućuje snimanje aktivnosti na webu i export te snimke u obliku *.jmx file-a koji je korišten unutar JMeter-a.  


## Testirane-funkcionalnosti

Funkcionalnosti testirane su: login, login-logout, login-add_to_collection, search_book (sa otvaranjem pronađene knjige), te otvaranje zasebne stranice koja pruža api. <br/>
Svi testovi su se izvodili unutar istog thread group-a, sa 50 threadova (korisnika) i ramp-up periodom od 10 sekundi. Veći broj korisnika izazvao je neočekivana ponašanja (sa moje strane), kao prestanak rada jmetera.

## Koraci-prilikom-kreiranja-testova

1. Pokretanje snimanja aktivnosti na webu pomoću BlazeMeter-a
2. Navođenje do https://demoqa.com/books
3. Obavljanje testirane aktivnosti
4. Prekidanje snimanja
5. Export snimke u *.jmx formatu
6. Prebacivanje kreirane snimke u Apache JMeter (drag and drop ili pomoću file -> open)
7. Individualno testiranje
8. Analiza rezultata
