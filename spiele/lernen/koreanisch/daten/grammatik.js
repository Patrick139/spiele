// grammatik.js — Grammatikteil: Grundlagen-Seiten und zu jeder Regel der Lektionen eine genauere Erklärung mit Beispielen.
//
// regeln: Schlüssel = Lektion + "n" + Platz der Notiz in der Lektion (a1-03n2 = zweite Notiz von Lektion 3).
//   mehr: genauere Erklärung · kv: true, wenn die Form davon abhängt, ob das Wort auf Konsonant oder Vokal endet
//   bsp:  [Koreanisch, Deutsch, Hinweis (optional)]; eckige Klammern heben die Stelle hervor, um die es geht.
// grund: Übersichtsseiten. text = Absätze, tabelle = Zeilen (erste Zeile Kopf), danach = Absätze nach der Tabelle,
//   siehe = Regeln, auf die verwiesen wird.
// Kennung eines Beispiels = Schlüssel + "b" + Platz (a1-03n2b4, g-kvb2); daran hängt die Tondatei.
// Wie überall: Beispiele nur ANS ENDE anhängen, nichts umreihen, nichts löschen (stilllegen mit null).
KO.grammatik({
  grund: [
    { id: "g-kv", titel: "Konsonant oder Vokal am Wortende", kurz: "Woran man erkennt, ob 은 oder 는, 이 oder 가, 을 oder 를 folgt.",
      text: [
        "Jede koreanische Silbe ist ein Block. Oben oder links steht der Anfangslaut, daneben oder darunter der Vokal. Steht ganz unten noch ein weiteres Zeichen, ist das der Schlusskonsonant. Auf Koreanisch heißt er 받침 (Batchim).",
        "Hat die letzte Silbe eines Wortes ein Batchim, endet das Wort auf Konsonant: 책, 물, 사람, 빵. Hat sie keines, endet es auf Vokal: 사과, 친구, 저, 커피.",
        "Vokale sind ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ und ihre Verbindungen (ㅐ ㅔ ㅘ ㅝ ㅢ …). Alle anderen Zeichen sind Konsonanten. Vorsicht bei ㅇ: Am Silbenanfang ist es stumm und nur Platzhalter (아, 오), unten in der Silbe ist es ein Konsonant und klingt wie „ng“ (빵, 강)."
      ],
      tabelle: [
        ["", "nach Konsonant (책, 물, 빵)", "nach Vokal (사과, 친구, 저)"],
        ["Thema", "은", "는"],
        ["Subjekt", "이", "가"],
        ["Objekt", "을", "를"],
        ["sein", "이에요", "예요"],
        ["per, nach, mit", "으로 (nach ㄹ nur 로)", "로"],
        ["bitte tun Sie", "으세요", "세요"],
        ["Zukunft, Vorschlag, Zusage", "을 거예요 · 을까요 · 을게요", "ㄹ kommt unten an die Silbe: 갈 거예요 · 갈까요 · 갈게요"]
      ],
      danach: [
        "Der Grund ist die Aussprache. Nach einem Konsonanten folgt eine Form, die mit einem Vokal beginnt. Dann rutscht der Konsonant hinüber und es spricht sich flüssig: 책이 klingt wie [채기], 물을 wie [무를].",
        "Merkhilfe: Die Formen mit 으 oder 이 am Anfang (은, 이, 을, 이에요, 으로, 으세요) gehören zum Konsonanten."
      ],
      bsp: [
        ["책[이] 있어요.", "Ich habe ein Buch.", "책 hat unten ㄱ → Konsonant → 이"],
        ["사과[가] 있어요.", "Ich habe einen Apfel.", "과 endet auf ㅏ → Vokal → 가"],
        ["물[을] 마셔요.", "Ich trinke Wasser.", "물 hat unten ㄹ → 을"],
        ["커피[를] 마셔요.", "Ich trinke Kaffee.", "피 endet auf ㅣ → 를"],
        ["선생님[은] 한국 사람이에요.", "Die Lehrerin ist Koreanerin.", "님 hat unten ㅁ → 은"],
        ["친구[는] 독일 사람이에요.", "Mein Freund ist Deutscher.", "구 endet auf ㅜ → 는"],
        ["빵[이에요].", "Das ist Brot.", "ㅇ unten ist ein Konsonant → 이에요"],
        ["우유[예요].", "Das ist Milch.", "유 endet auf Vokal → 예요"]
      ],
      siehe: ["a1-01n1", "a1-01n2", "a1-02n1", "a1-03n1", "a1-12n3", "a1-11n1", "a1-19n1"] },

    { id: "g-partikeln", titel: "Die Partikeln im Überblick", kurz: "Die kurzen Anhängsel hinter dem Wort – was sie leisten und wo sie erklärt sind.",
      text: [
        "Partikeln sind kurze Anhängsel direkt hinter einem Wort. Sie leisten, was im Deutschen Fälle, Artikel und Vorwörter leisten: Sie zeigen, welche Rolle das Wort im Satz spielt.",
        "Weil die Rolle am Wort selbst hängt, ist die Reihenfolge der Satzteile ziemlich frei. Fest ist nur: Das Verb steht am Ende."
      ],
      tabelle: [
        ["Partikel", "Aufgabe", "Beispiel"],
        ["은 / 는", "Thema: „was … betrifft“, auch Gegensatz", "저는 · 오늘은"],
        ["이 / 가", "wer oder was (Subjekt), neue Information", "비가 와요 · 시간이 있어요"],
        ["을 / 를", "wen oder was (Objekt)", "밥을 먹어요 · 커피를 마셔요"],
        ["에", "wohin, wo etwas ist, wann", "집에 가요 · 세 시에"],
        ["에서", "wo man etwas tut; von … her", "집에서 일해요 · 한국에서 왔어요"],
        ["도", "auch", "저도 가요"],
        ["(으)로", "Richtung, Mittel, Sprache, Auswahl", "왼쪽으로 · 카드로 · 한국어로"],
        ["부터 / 까지", "ab, seit / bis", "어제부터 · 공항까지"],
        ["하고", "und (zwischen Nomen), zusammen mit", "빵하고 우유 · 친구하고 가요"],
        ["의", "von (Besitz), gesprochen [에]; fällt meist weg", "친구의 차 = 친구 차"]
      ],
      danach: [
        "Im Gespräch fallen 은/는, 이/가 und 을/를 oft weg, wenn klar ist, was gemeint ist (밥 먹었어요?). Die anderen Partikeln bleiben.",
        "Welche der beiden Formen passt (은 oder 는, 이 oder 가 …), steht auf der Seite „Konsonant oder Vokal am Wortende“."
      ],
      bsp: [
        ["저[는] 집[에서] 한국어[를] 공부해요.", "Ich lerne zu Hause Koreanisch.", "Thema · Ort der Handlung · Objekt"],
        ["친구[가] 내일 한국[에] 가요.", "Mein Freund fliegt morgen nach Korea.", "Subjekt · Ziel"],
        ["빵[하고] 우유[를] 샀어요.", "Ich habe Brot und Milch gekauft."],
        ["아내[하고] 같이 왔어요.", "Ich bin mit meiner Frau gekommen."],
        ["친구[의] 차예요.", "Das ist das Auto eines Freundes."],
        ["저[도] 커피[로] 할게요.", "Ich nehme auch Kaffee.", "auch · Auswahl"]
      ],
      siehe: ["a1-01n1", "a1-02n1", "a1-03n1", "a1-06n2", "a1-07n1", "a1-07n2", "a1-18n2", "a1-12n3", "a1-15n1", "a1-20n2"] },

    { id: "g-gegenwart", titel: "Die höfliche Gegenwart bilden", kurz: "Wie aus der Grundform (먹다) die Alltagsform (먹어요) wird.",
      text: [
        "Im Wörterbuch stehen Verben und Eigenschaftswörter in der Grundform auf 다. Im Gespräch braucht man die höfliche Form auf 요.",
        "Schritt 1: 다 weglassen. Übrig bleibt der Stamm (먹다 → 먹).",
        "Schritt 2: Den letzten Vokal des Stamms ansehen. Ist er ㅏ oder ㅗ, kommt 아요. Bei allen anderen Vokalen kommt 어요.",
        "Schritt 3: 하다 wird immer zu 해요.",
        "Schritt 4: Endet der Stamm selbst auf einen Vokal, verschmilzt er mit der Endung."
      ],
      tabelle: [
        ["Stamm", "Rechnung", "Ergebnis"],
        ["살 (wohnen)", "ㅏ → 살 + 아요", "살아요"],
        ["좋 (gut sein)", "ㅗ → 좋 + 아요", "좋아요"],
        ["먹 (essen)", "ㅓ → 먹 + 어요", "먹어요"],
        ["읽 (lesen)", "ㅣ → 읽 + 어요", "읽어요"],
        ["가 (gehen)", "가 + 아요 verschmilzt", "가요"],
        ["오 (kommen)", "오 + 아요 verschmilzt", "와요"],
        ["보 (sehen)", "보 + 아요 verschmilzt", "봐요"],
        ["마시 (trinken)", "마시 + 어요 verschmilzt", "마셔요"],
        ["주 (geben)", "주 + 어요 verschmilzt", "줘요"],
        ["배우 (lernen)", "배우 + 어요 verschmilzt", "배워요"],
        ["쓰 (schreiben)", "ㅡ fällt weg, dann 어요", "써요"],
        ["하 (machen)", "immer", "해요"]
      ],
      danach: [
        "Aus dieser Form lassen sich fast alle anderen ableiten: Vergangenheit (요 weg, ㅆ어요 dran: 갔어요), Bitte (요 weg, 주세요 dran: 가 주세요), müssen (가야 해요), dürfen (가도 돼요), vertraute Form (요 weg: 가)."
      ],
      bsp: [
        ["선물을 [줘요].", "Ich gebe ein Geschenk.", "주 + 어요 → 줘요"],
        ["텔레비전을 [봐요].", "Ich schaue fern.", "보 + 아요 → 봐요"],
        ["매일 [배워요].", "Ich lerne jeden Tag.", "배우 + 어요 → 배워요"],
        ["문을 [닫아요].", "Ich mache die Tür zu.", "ㅏ → 아요"],
        ["문을 [열어요].", "Ich mache die Tür auf.", "ㅕ → 어요"],
        ["같이 [해요].", "Machen wir es zusammen.", "하다 → 해요"]
      ],
      siehe: ["a1-03n2", "a1-09n1", "a1-09n3", "a1-10n2", "a1-10n3"] },

    { id: "g-stufen", titel: "Sprechstufen: wann welche Form", kurz: "Höflich, förmlich, vertraut, ehrend – und mit wem man wie spricht.",
      text: [
        "Koreanisch zeigt am Satzende, wie man zum Gegenüber steht. Für den Alltag reichen drei Stufen und ein Zusatz."
      ],
      tabelle: [
        ["Stufe", "Endung", "Mit wem", "Beispiel"],
        ["höflich (Standard)", "-아요 / -어요", "Fremde, Bekannte, im Geschäft, ältere Verwandte im Alltag", "가요 · 먹어요"],
        ["förmlich", "-습니다 / -ㅂ니다", "feste Formeln, Vorstellung, Durchsagen, Arbeit", "감사합니다 · 잘 먹겠습니다"],
        ["vertraut", "ohne 요", "Kind, Ehepartner, enge Freunde", "가 · 먹어"],
        ["ehrend (Zusatz)", "-(으)시- oder eigenes Verb", "wenn Ältere oder Fremde etwas tun", "가세요 · 드세요 · 계세요"]
      ],
      danach: [
        "Im Zweifel immer die höfliche Stufe. Ins Vertraute wechselt man erst, wenn der Ältere es anbietet.",
        "Die ehrende Form sagt man über den anderen, nie über sich selbst. Mit Schwiegereltern bleibt man höflich und ehrend, auch nach vielen Jahren."
      ],
      bsp: [
        ["어디 [가요]?", "Wohin gehst du? / Wohin gehen Sie?", "höflich"],
        ["어디 [가세요]?", "Wohin gehen Sie?", "höflich und ehrend"],
        ["어디 [가]?", "Wohin gehst du?", "vertraut"],
        ["밥 [먹었어요]?", "Hast du gegessen?", "höflich"],
        ["식사 [하셨어요]?", "Haben Sie gegessen?", "ehrend, mit dem feineren Wort 식사"],
        ["밥 [먹었어]?", "Hast du gegessen?", "vertraut"]
      ],
      siehe: ["a1-03n2", "a1-16n1", "a1-16n4", "a1-17n1"] },

    { id: "g-unreg", titel: "Unregelmäßige Verben im Überblick", kurz: "Sechs Gruppen, bei denen sich der Stamm vor einem Vokal ändert.",
      text: [
        "Unregelmäßig heißt hier: Der Stamm ändert sich, sobald eine Endung mit Vokal folgt (-아요/어요, -았어요, -(으)세요 …). Vor Endungen mit Konsonant (-고, -지 마세요) bleibt er unverändert."
      ],
      tabelle: [
        ["Gruppe", "Was vor einem Vokal passiert", "Beispiele"],
        ["ㅂ", "ㅂ wird zu 우", "덥다 → 더워요 · 맵다 → 매워요 · 쉽다 → 쉬워요"],
        ["ㄷ", "ㄷ wird zu ㄹ", "듣다 → 들어요 · 걷다 → 걸어요"],
        ["ㅡ", "ㅡ fällt weg", "바쁘다 → 바빠요 · 쓰다 → 써요 · 크다 → 커요"],
        ["르", "르 wird zu ㄹ라 / ㄹ러", "모르다 → 몰라요 · 빠르다 → 빨라요 · 배부르다 → 배불러요"],
        ["ㅅ", "ㅅ fällt weg", "낫다 → 나아요"],
        ["ㄹ", "ㄹ fällt vor ㄴ, ㅂ, ㅅ weg", "살다 → 사세요 · 알다 → 아세요 · 멀다 → 먼"]
      ],
      danach: [
        "Nicht jedes Wort mit diesem Buchstaben gehört dazu. Regelmäßig sind zum Beispiel 입다 → 입어요, 받다 → 받아요, 닫다 → 닫아요, 웃다 → 웃어요, 씻다 → 씻어요."
      ],
      bsp: [
        ["음악을 [듣고] 있어요.", "Ich höre gerade Musik.", "vor 고 bleibt 듣 unverändert"],
        ["잘 [들었어요].", "Ich habe gut zugehört.", "vor Vokal: 듣 → 들"],
        ["이름을 [몰라요].", "Ich weiß den Namen nicht.", "모르 → 몰라"],
        ["버스가 [빨라요].", "Der Bus ist schnell.", "빠르 → 빨라"],
        ["감기가 다 [나았어요].", "Die Erkältung ist ganz weg.", "낫 → 나아"],
        ["어디 [사세요]?", "Wo wohnen Sie?", "살 + 세요 → 사세요"]
      ],
      siehe: ["a1-09n3", "a1-10n2", "a1-10n3"] }
  ],

  regeln: {
    // ---------- Lektion 1 ----------
    "a1-01n1": { kv: true, mehr: "은/는 hebt hervor, worüber man gerade spricht: „was X betrifft …“. Oft steckt ein Gegensatz darin (A는 so, B는 anders). Wichtig ist nur die letzte Silbe davor: Hat sie unten einen Konsonanten, folgt 은, sonst 는.", bsp: [
      ["저[는] 한국어를 공부해요.", "Ich lerne Koreanisch.", "저 endet auf Vokal → 는"],
      ["이 빵[은] 맛있어요.", "Dieses Brot schmeckt gut.", "빵 hat unten ㅇ → 은"],
      ["오늘[은] 일요일이에요.", "Heute ist Sonntag.", "늘 hat unten ㄹ → 은"],
      ["아버지[는] 집에 계세요.", "Der Vater ist zu Hause."],
      ["커피[는] 좋아해요. 차[는] 안 좋아해요.", "Kaffee mag ich. Tee mag ich nicht.", "Gegensatz"]
    ] },
    "a1-01n2": { kv: true, mehr: "Entspricht „ist, bin, sind“ – aber nur zwischen zwei Nomen (A ist B). Für „ist da“ nimmt man 있어요, für Eigenschaften das Eigenschaftswort selbst. Als Frage bleibt die Form gleich, nur die Stimme hebt sich.", bsp: [
      ["학생[이에요].", "Ich bin Student.", "생 hat unten ㅇ → 이에요"],
      ["의사[예요].", "Sie ist Ärztin.", "사 endet auf Vokal → 예요"],
      ["이거 물[이에요]?", "Ist das Wasser?"],
      ["제 친구[예요].", "Das ist mein Freund."],
      ["오늘 생일[이에요].", "Heute ist mein Geburtstag."],
      ["여기[예요].", "Hier ist es."]
    ] },
    "a1-01n3": { kv: true, mehr: "Verneint nur „A ist B“. Das Nomen davor bekommt 이 (nach Konsonant) oder 가 (nach Vokal). Beim Sprechen fällt 이/가 oft weg.", bsp: [
      ["학생[이 아니에요].", "Ich bin kein Student."],
      ["의사[가 아니에요].", "Ich bin kein Arzt."],
      ["제 가방[이 아니에요].", "Das ist nicht meine Tasche."],
      ["오늘[이 아니에요]. 내일이에요.", "Nicht heute. Morgen."],
      ["커피[가 아니에요]. 차예요.", "Das ist kein Kaffee. Das ist Tee."]
    ] },
    // ---------- Lektion 2 ----------
    "a1-02n1": { kv: true, mehr: "이/가 zeigt, wer oder was etwas ist oder tut – vor allem bei neuer Information und in Fragen. Faustregel: Neues bekommt 이/가, schon Bekanntes oder ein Gegensatz bekommt 은/는. Vor 있어요, 없어요, 아파요, 좋아요 steht fast immer 이/가.", bsp: [
      ["시간[이] 있어요.", "Ich habe Zeit.", "간 hat unten ㄴ → 이"],
      ["친구[가] 와요.", "Ein Freund kommt.", "구 endet auf Vokal → 가"],
      ["뭐[가] 맛있어요?", "Was schmeckt gut?"],
      ["날씨[가] 좋아요.", "Das Wetter ist schön."],
      ["다리[가] 아파요.", "Mir tut das Bein weh."],
      ["누[가] 했어요?", "Wer hat das gemacht?", "누구 + 가 wird zu 누가"]
    ] },
    "a1-02n2": { mehr: "있어요 bedeutet zweierlei: „ist da, es gibt“ und „ich habe“. Das Ding bekommt 이/가. Wer es hat, steht mit 은/는 vorne oder fällt weg. Mit Ort: Ort + 에 있어요.", bsp: [
      ["차[가 있어요].", "Ich habe ein Auto."],
      ["지금 시간[이 없어요].", "Jetzt habe ich keine Zeit."],
      ["질문 [있어요]?", "Gibt es Fragen?"],
      ["여기 화장실 [없어요].", "Hier gibt es keine Toilette."],
      ["집에 아이가 [있어요].", "Das Kind ist zu Hause."]
    ] },
    "a1-02n3": { mehr: "계세요 ist die ehrende Form von 있어요 – nur für Personen und nur für „da sein“, nicht für „haben“. Über sich selbst verwendet man sie nie. Verneinung: 안 계세요.", bsp: [
      ["어머니는 집에 [계세요].", "Die Mutter ist zu Hause."],
      ["선생님 [계세요]?", "Ist die Lehrerin da?"],
      ["아버님은 지금 안 [계세요].", "Vater ist gerade nicht da."],
      ["할아버지는 한국에 [계세요].", "Der Großvater ist in Korea."]
    ] },
    "a1-02n4": { mehr: "Besitz wird einfach vorangestellt: 제 + Nomen. Koreaner sagen 우리 auch dann, wenn nur „mein“ gemeint ist – bei Familie, Zuhause, Firma und Land. 우리 아내 heißt „meine Frau“. In der vertrauten Form (zu Kind oder Partner) sagt man 내 statt 제.", bsp: [
      ["[제] 휴대폰이에요.", "Das ist mein Handy."],
      ["[우리] 집에 오세요.", "Kommen Sie zu uns nach Hause."],
      ["[우리] 아내는 한국 사람이에요.", "Meine Frau ist Koreanerin.", "wörtlich: unsere Frau"],
      ["[제] 친구 민수예요.", "Das ist mein Freund Minsu."],
      ["[우리] 나라는 작아요.", "Mein Land ist klein."],
      ["[내] 거야.", "Das gehört mir.", "vertraut"]
    ] },
    // ---------- Lektion 3 ----------
    "a1-03n1": { kv: true, mehr: "을/를 markiert, worauf sich die Handlung richtet. Im Alltag fällt es sehr oft weg (밥 먹어요). Achtung: 좋아해요 (mögen) verlangt 을/를, 좋아요 (ist gut) dagegen 이/가.", bsp: [
      ["책[을] 읽어요.", "Ich lese ein Buch.", "책 hat unten ㄱ → 을"],
      ["영화[를] 봐요.", "Ich schaue einen Film.", "화 endet auf Vokal → 를"],
      ["한국어[를] 배워요.", "Ich lerne Koreanisch."],
      ["빵[을] 사요.", "Ich kaufe Brot."],
      ["음악[을] 좋아해요.", "Ich mag Musik.", "좋아해요 → 을/를"],
      ["뭐[를] 마셔요?", "Was trinkst du?"]
    ] },
    "a1-03n2": { mehr: "Regel: Ist der letzte Vokal des Stamms ㅏ oder ㅗ, kommt 아요, sonst 어요. 하다 wird zu 해요. Endet der Stamm auf Vokal, verschmelzen Stamm und Endung. Dieselbe Form dient als Aussage, als Frage (Stimme hoch) und als sanfte Aufforderung. Alle Schritte stehen auf der Grundlagen-Seite „Die höfliche Gegenwart bilden“.", verweis: "g-gegenwart", bsp: [
      ["여기 [살아요].", "Ich wohne hier.", "살 + 아요"],
      ["신문을 [읽어요].", "Ich lese Zeitung.", "읽 + 어요"],
      ["학교에 [가요].", "Ich gehe in die Schule.", "가 + 아요 → 가요"],
      ["친구가 [와요].", "Ein Freund kommt.", "오 + 아요 → 와요"],
      ["물을 [마셔요].", "Ich trinke Wasser.", "마시 + 어요 → 마셔요"],
      ["지금 [공부해요].", "Ich lerne gerade.", "하다 → 해요"]
    ] },
    "a1-03n3": { mehr: "주세요 heißt „geben Sie bitte“. Das Nomen steht einfach davor. Mit Menge: Nomen + Zahl + Zählwort + 주세요. Höflich genug für Lokal, Geschäft und Taxi.", bsp: [
      ["이거 [주세요].", "Das hier, bitte."],
      ["물 한 잔 [주세요].", "Ein Glas Wasser, bitte."],
      ["김치 더 [주세요].", "Noch Kimchi, bitte."],
      ["커피 두 잔 [주세요].", "Zwei Kaffee, bitte."],
      ["숟가락 [주세요].", "Einen Löffel, bitte."]
    ] },
    // ---------- Lektion 4 ----------
    "a1-04n1": { mehr: "Faustregel: Was man abliest oder misst (Preis, Datum, Minuten, Nummern, Stockwerk, Monat), nimmt 일, 이, 삼. Was man abzählt (Stück, Personen, Alter, Stunden), nimmt 하나, 둘, 셋 – siehe Lektion 5.", bsp: [
      ["[삼천] 원이에요.", "Das kostet 3.000 Won."],
      ["[이] 층에 있어요.", "Es ist im zweiten Stock."],
      ["[십오] 분 걸려요.", "Es dauert 15 Minuten."],
      ["[구]월이에요.", "Es ist September."],
      ["[칠] 번 버스를 타요.", "Ich nehme den Bus Nummer 7."]
    ] },
    "a1-04n2": { mehr: "Wie Bausteine: zuerst die Zahl der Zehner, dann 십, dann die Einer. Die Eins vor 십, 백 und 천 lässt man weg: 10 ist 십, nicht 일십.", bsp: [
      ["[십이]월이에요.", "Es ist Dezember.", "10 + 2"],
      ["[삼십] 분 기다렸어요.", "Ich habe 30 Minuten gewartet.", "3 × 10"],
      ["[사십오] 번이에요.", "Es ist Nummer 45.", "4 × 10 + 5"],
      ["[천오백] 원이에요.", "Das kostet 1.500 Won.", "1.000 + 5 × 100"],
      ["[이십] 분 걸려요.", "Es dauert 20 Minuten."]
    ] },
    "a1-04n3": { mehr: "Koreanisch bündelt in Zehntausendern statt in Tausendern. 50.000 ist 오만 (5 × 10.000), eine Million ist 백만 (100 × 10.000). Bei Preisen in Won braucht man das ständig: Ein Mittagessen kostet rund 만 원.", bsp: [
      ["[삼만] 원이에요.", "Das kostet 30.000 Won."],
      ["[오만] 원 있어요.", "Ich habe 50.000 Won."],
      ["[십만] 원이에요.", "Das kostet 100.000 Won."],
      ["[만 오천] 원이에요.", "Das kostet 15.000 Won."],
      ["[백만] 원은 너무 비싸요.", "Eine Million Won ist zu teuer."]
    ] },
    "a1-04n4": { mehr: "Monatsnamen gibt es nicht, man zählt: erster Monat, zweiter Monat. Der Tag im Datum ist Zahl + 일. Die Reihenfolge geht immer von groß nach klein: Jahr, Monat, Tag.", bsp: [
      ["지금 [삼월]이에요.", "Jetzt ist März."],
      ["생일은 [구월]이에요.", "Mein Geburtstag ist im September."],
      ["[유월]에 한국에 가요.", "Im Juni fliege ich nach Korea.", "6 ist 육, Juni aber 유월"],
      ["[시월]은 추워요?", "Ist es im Oktober kalt?", "10 ist 십, Oktober aber 시월"],
      ["[일월]에 여행해요.", "Im Jänner verreisen wir."]
    ] },
    // ---------- Lektion 5 ----------
    "a1-05n1": { mehr: "Diese Reihe reicht bis 99. Im Alltag braucht man sie vor allem für Uhrzeit-Stunden, Alter, Stück und Personen. Über 10 wird zusammengesetzt: 열 + 하나 = 열하나.", bsp: [
      ["아이는 [여섯] 살이에요.", "Das Kind ist sechs Jahre alt."],
      ["[열두] 시예요.", "Es ist zwölf Uhr."],
      ["사과 [다섯] 개 주세요.", "Fünf Äpfel, bitte."],
      ["친구 [열] 명이 와요.", "Zehn Freunde kommen."],
      ["저는 [서른여덟] 살이에요.", "Ich bin 38 Jahre alt.", "30 + 8"]
    ] },
    "a1-05n2": { mehr: "Nur 1, 2, 3, 4 und 20 ändern sich, und nur direkt vor einem Zählwort. Beim bloßen Abzählen bleibt es bei 하나, 둘, 셋, 넷.", bsp: [
      ["맥주 [한] 병 주세요.", "Eine Flasche Bier, bitte."],
      ["아이가 [두] 명 있어요.", "Ich habe zwei Kinder."],
      ["[세] 시에 만나요.", "Treffen wir uns um drei."],
      ["[네] 개 있어요.", "Es sind vier Stück da."],
      ["[스무] 살이에요.", "Er ist zwanzig Jahre alt."]
    ] },
    "a1-05n3": { mehr: "Anders als im Deutschen steht das Ding zuerst, dann die Menge. Das Zählwort hängt vom Ding ab: 개 für Dinge allgemein, 명 für Personen, 잔 für Gläser und Tassen, 병 für Flaschen, 살 für Lebensjahre, 번 für „Mal“. Im Zweifel passt 개.", bsp: [
      ["물 [한 병] 주세요.", "Eine Flasche Wasser, bitte."],
      ["친구 [세 명]이 왔어요.", "Drei Freunde sind gekommen."],
      ["빵 [두 개] 샀어요.", "Ich habe zwei Stück Brot gekauft."],
      ["맥주 [한 잔] 더 주세요.", "Noch ein Glas Bier, bitte."],
      ["하루에 [한 번] 먹어요.", "Ich esse es einmal am Tag."]
    ] },
    // ---------- Lektion 6 ----------
    "a1-06n1": { mehr: "Stunden zählt man ab (koreanische Reihe mit den Kurzformen 한, 두, 세, 네). Minuten liest man ab (die andere Reihe). 오전 (vormittags) und 오후 (nachmittags) stehen davor. 반 ersetzt 삼십 분.", bsp: [
      ["[한 시]예요.", "Es ist ein Uhr."],
      ["[네 시 반]에 만나요.", "Treffen wir uns um halb fünf.", "vier Uhr halb = 4:30"],
      ["[여섯 시 십 분]이에요.", "Es ist zehn nach sechs."],
      ["오전 [아홉 시]에 시작해요.", "Es beginnt um neun Uhr vormittags."],
      ["오후 [두 시]에 끝나요.", "Es endet um zwei Uhr nachmittags."],
      ["[열한 시]에 자요.", "Ich gehe um elf schlafen."]
    ] },
    "a1-06n2": { mehr: "에 entspricht hier „um, am, im“. Faustregel: Wörter, die vom heutigen Tag aus zeigen (오늘, 내일, 어제, 지금, 매일, 이따가), stehen ohne 에.", bsp: [
      ["월요일[에] 일해요.", "Am Montag arbeite ich."],
      ["저녁[에] 운동해요.", "Am Abend mache ich Sport."],
      ["세 시[에] 와요.", "Ich komme um drei."],
      ["주말[에] 뭐 해요?", "Was machst du am Wochenende?"],
      ["밤[에] 공부해요.", "Ich lerne in der Nacht."],
      ["내일 만나요.", "Treffen wir uns morgen.", "내일 steht ohne 에"]
    ] },
    // ---------- Lektion 7 ----------
    "a1-07n1": { mehr: "Bei Bewegung (가요, 와요, 도착해요) nennt 에 das Ziel. Bei 있어요, 없어요, 살아요 nennt es den Ort, an dem etwas ist. Beim Sprechen fällt 에 nach Ortswörtern oft weg (어디 가요?).", bsp: [
      ["회사[에] 가요.", "Ich gehe in die Firma."],
      ["한국[에] 왔어요.", "Ich bin nach Korea gekommen."],
      ["지금 집[에] 있어요.", "Ich bin jetzt zu Hause."],
      ["화장실은 이 층[에] 있어요.", "Die Toilette ist im zweiten Stock."],
      ["서울[에] 살아요.", "Ich wohne in Seoul."]
    ] },
    "a1-07n2": { mehr: "에서 nennt den Ort, an dem etwas getan wird: essen, arbeiten, treffen, kaufen. Zum Vergleich: 집에 있어요 (ich bin zu Hause) – 집에서 일해요 (ich arbeite zu Hause). Zweite Bedeutung: „aus, von … her“.", bsp: [
      ["카페[에서] 만나요.", "Treffen wir uns im Café."],
      ["회사[에서] 일해요.", "Ich arbeite in der Firma."],
      ["마트[에서] 샀어요.", "Ich habe es im Supermarkt gekauft."],
      ["집[에서] 요리해요.", "Ich koche zu Hause."],
      ["오스트리아[에서] 왔어요.", "Ich komme aus Österreich.", "hier: aus"],
      ["어디[에서] 먹어요?", "Wo essen wir?"]
    ] },
    "a1-07n3": { mehr: "타요 heißt einsteigen und mitfahren. Womit man unterwegs ist, kann auch mit (으)로 stehen: 버스로 가요. Aussteigen heißt 내려요, der Ort bekommt 에서.", bsp: [
      ["버스[를 타요].", "Ich fahre mit dem Bus."],
      ["비행기[를 타요].", "Ich fliege."],
      ["자전거[를 타요].", "Ich fahre Rad."],
      ["몇 번 버스[를 타요]?", "Welchen Bus nimmt man?"],
      ["지하철[로] 가요.", "Ich fahre mit der U-Bahn hin."]
    ] },
    // ---------- Lektion 8 ----------
    "a1-08n1": { mehr: "Drei Entfernungen: 이 (bei mir), 그 (bei dir oder eben erwähnt), 저 (von uns beiden entfernt). Dasselbe bei Orten: 여기, 거기, 저기. Vor einem Nomen: 이 책, 그 사람, 저 건물.", bsp: [
      ["[이거] 맛있어요.", "Das hier schmeckt gut."],
      ["[그거] 뭐예요?", "Was ist das da bei dir?"],
      ["[저거] 주세요.", "Das dort, bitte."],
      ["[이] 사람은 누구예요?", "Wer ist dieser Mensch?"],
      ["[그] 영화 봤어요?", "Hast du den Film gesehen?", "den, über den wir sprachen"],
      ["[저] 건물이에요.", "Es ist das Gebäude dort."]
    ] },
    "a1-08n2": { mehr: "Das Ortswort steht hinter dem Nomen – umgekehrt wie im Deutschen: „Tisch oben auf“. Wird an dem Ort etwas getan, steht 에서 statt 에.", bsp: [
      ["의자 [위에] 있어요.", "Es liegt auf dem Stuhl."],
      ["침대 [아래에] 있어요.", "Es liegt unter dem Bett."],
      ["냉장고 [안에] 물이 있어요.", "Im Kühlschrank ist Wasser."],
      ["은행 [옆에] 있어요.", "Es ist neben der Bank."],
      ["역 [앞에서] 만나요.", "Treffen wir uns vor dem Bahnhof.", "Handlung → 에서"],
      ["문 [뒤에] 있어요.", "Es ist hinter der Tür."]
    ] },
    // ---------- Lektion 9 ----------
    "a1-09n1": { mehr: "Am einfachsten aus der höflichen Gegenwart ableiten: 요 weg, ㅆ어요 dran. 가요 → 갔어요, 먹어요 → 먹었어요, 해요 → 했어요. Das gilt genauso für Eigenschaftswörter (좋아요 → 좋았어요).", bsp: [
      ["어제 [갔어요].", "Ich bin gestern hingegangen.", "가요 → 갔어요"],
      ["밥 [먹었어요]?", "Hast du schon gegessen?", "먹어요 → 먹었어요"],
      ["많이 [잤어요].", "Ich habe viel geschlafen."],
      ["책을 [읽었어요].", "Ich habe ein Buch gelesen."],
      ["어제 [일했어요].", "Gestern habe ich gearbeitet.", "해요 → 했어요"],
      ["친구가 [왔어요].", "Ein Freund ist gekommen.", "와요 → 왔어요"]
    ] },
    "a1-09n2": { mehr: "안 verneint Verben und Eigenschaftswörter. Der Unterschied zu 못 (Lektion 23): 안 heißt „ich tue es nicht“, 못 heißt „ich kann nicht“. Statt 안 있어요 sagt man 없어요, statt 안 이에요 sagt man 아니에요.", bsp: [
      ["[안] 가요.", "Ich gehe nicht hin."],
      ["[안] 먹어요.", "Ich esse nicht."],
      ["[안] 추워요.", "Es ist nicht kalt."],
      ["공부 [안] 해요.", "Ich lerne nicht.", "bei 하다 nach dem Nomen"],
      ["어제 [안] 잤어요.", "Gestern habe ich nicht geschlafen."],
      ["[안] 비싸요.", "Es ist nicht teuer."]
    ] },
    "a1-09n3": { mehr: "Diese Verben ändern ihren Stamm nur vor einem Vokal, also bei -아요/어요 und -았어요. Vor einem Konsonanten bleibt der Stamm (듣고, 쓰고). Alle Gruppen stehen auf der Grundlagen-Seite „Unregelmäßige Verben im Überblick“.", verweis: "g-unreg", bsp: [
      ["노래를 [들었어요].", "Ich habe ein Lied gehört.", "듣다: ㄷ → ㄹ"],
      ["이름을 [써요].", "Ich schreibe den Namen.", "쓰다: ㅡ fällt weg"],
      ["잘 [몰라요].", "Ich weiß es nicht genau.", "모르다 → 몰라요"],
      ["많이 [걸어요].", "Ich gehe viel zu Fuß.", "걷다: ㄷ → ㄹ"],
      ["한국어로 [썼어요].", "Ich habe es auf Koreanisch geschrieben."]
    ] },
    // ---------- Lektion 10 ----------
    "a1-10n1": { mehr: "„Groß sein“ ist im Koreanischen ein einziges Wort (크다) und wird wie ein Verb gebeugt: Gegenwart 커요, Vergangenheit 컸어요, Verneinung 안 커요. Das Ding davor bekommt 이/가 oder 은/는.", bsp: [
      ["방이 [작아요].", "Das Zimmer ist klein."],
      ["음식이 [맛있어요].", "Das Essen schmeckt gut."],
      ["이 가방은 [비싸요].", "Diese Tasche ist teuer."],
      ["어제는 [추웠어요].", "Gestern war es kalt."],
      ["안 [어려워요].", "Es ist nicht schwierig."],
      ["사람이 [많았어요].", "Es waren viele Leute da."]
    ] },
    "a1-10n2": { mehr: "Vor einem Vokal wird ㅂ zu 우, und 우 + 어요 verschmilzt zu 워요. Einige Wörter behalten ㅂ: 입다 → 입어요, 잡다 → 잡아요.", bsp: [
      ["오늘 [더워요].", "Heute ist es heiß.", "덥다"],
      ["김치가 [매워요].", "Das Kimchi ist scharf.", "맵다"],
      ["가방이 [무거워요].", "Die Tasche ist schwer.", "무겁다"],
      ["역이 [가까워요].", "Der Bahnhof ist nah.", "가깝다"],
      ["한국어가 [쉬워요]?", "Ist Koreanisch leicht?", "쉽다"],
      ["물이 [차가워요].", "Das Wasser ist kalt.", "차갑다"]
    ] },
    "a1-10n3": { mehr: "ㅡ verschwindet vor 아/어. Ob 아 oder 어 folgt, entscheidet der Vokal in der Silbe davor: 바쁘다 → 바빠요 (davor ㅏ), 예쁘다 → 예뻐요. Einsilbige Stämme nehmen 어: 크다 → 커요, 쓰다 → 써요.", bsp: [
      ["오늘 [바빠요].", "Heute bin ich beschäftigt.", "바쁘다"],
      ["눈이 [아파요].", "Mir tun die Augen weh.", "아프다"],
      ["꽃이 [예뻐요].", "Die Blumen sind hübsch.", "예쁘다"],
      ["사이즈가 [커요].", "Die Größe ist zu groß.", "크다"],
      ["기분이 [나빠요].", "Ich bin schlecht gelaunt.", "나쁘다"],
      ["배가 [고파요].", "Ich habe Hunger.", "고프다"]
    ] },
    "a1-10n4": { mehr: "Wetter beschreibt man mit 이/가 + Verb. Ein „es“ wie im Deutschen gibt es nicht. Wind „weht“ (불어요), der Himmel „ist klar“ (맑아요) oder „trüb“ (흐려요).", bsp: [
      ["비가 많이 [와요].", "Es regnet stark."],
      ["내일 눈이 [와요]?", "Schneit es morgen?"],
      ["바람이 [불어요].", "Es ist windig."],
      ["날씨가 [맑아요].", "Das Wetter ist klar."],
      ["오늘은 [흐려요].", "Heute ist es trüb."]
    ] },
    // ---------- Lektion 11 ----------
    "a1-11n1": { kv: true, mehr: "Der Stamm ist die Grundform ohne 다. Endet er auf Konsonant, folgt 으세요, sonst 세요. Das ist höflich, bleibt aber eine Aufforderung. Mit 좀 oder als -아/어 주세요 wird daraus eine Bitte. Als Frage ehrt dieselbe Endung den Angesprochenen (어디 가세요?).", bsp: [
      ["여기 [보세요].", "Schauen Sie hierher.", "보 endet auf Vokal → 세요"],
      ["이거 [읽으세요].", "Lesen Sie das.", "읽 endet auf Konsonant → 으세요"],
      ["천천히 [가세요].", "Gehen Sie langsam."],
      ["여기서 [기다리세요].", "Warten Sie hier."],
      ["조심히 [오세요].", "Kommen Sie gut her."],
      ["잘 [쉬세요].", "Ruhen Sie sich gut aus."]
    ] },
    "a1-11n2": { mehr: "주세요 hinter einem Verb heißt „tun Sie es bitte für mich“. Das Verb steht in der höflichen Gegenwart ohne 요: 기다려요 → 기다려 주세요. Das ist die höflichste einfache Bitte.", bsp: [
      ["문 좀 [열어 주세요].", "Machen Sie bitte die Tür auf."],
      ["사진 좀 [보내 주세요].", "Schicken Sie mir bitte das Foto."],
      ["여기 [써 주세요].", "Schreiben Sie es bitte hierher."],
      ["조금만 [기다려 주세요].", "Warten Sie bitte kurz."],
      ["이거 [봐 주세요].", "Schauen Sie sich das bitte an."],
      ["한 번 더 [해 주세요].", "Machen Sie es bitte noch einmal."]
    ] },
    "a1-11n3": { mehr: "지 hängt direkt am Stamm – gleich, ob er auf Konsonant oder Vokal endet. Die vertraute Form ist -지 마 (Lektion 17).", bsp: [
      ["[가지 마세요].", "Gehen Sie nicht."],
      ["[잊지 마세요].", "Vergessen Sie es nicht."],
      ["여기서 사진 [찍지 마세요].", "Bitte hier nicht fotografieren."],
      ["너무 많이 [먹지 마세요].", "Essen Sie nicht zu viel."],
      ["[늦지 마세요].", "Kommen Sie nicht zu spät."],
      ["지금 [전화하지 마세요].", "Rufen Sie jetzt bitte nicht an."]
    ] },
    "a1-11n4": { mehr: "Koreanisch braucht kein eigenes „lass uns“: 같이 + höfliche Gegenwart genügt. Deutlicher wird es mit -(으)ㄹ까요? (Vorschlag als Frage, Lektion 19) oder vertraut mit -자 (Lektion 17).", bsp: [
      ["[같이] 먹어요.", "Essen wir zusammen."],
      ["[같이] 공부해요.", "Lernen wir zusammen."],
      ["내일 [같이] 가요.", "Gehen wir morgen zusammen hin."],
      ["[같이] 영화 봐요.", "Schauen wir zusammen einen Film."],
      ["이제 가요.", "Gehen wir jetzt.", "auch ohne 같이, wenn die Lage klar ist"]
    ] },
    // ---------- Lektion 12 ----------
    "a1-12n1": { mehr: "고 hängt direkt am Stamm. Die Form gilt für eigene Wünsche und für Fragen an das Gegenüber. Verneinung: 안 -고 싶어요. Vergangenheit: -고 싶었어요.", bsp: [
      ["집에 [가고 싶어요].", "Ich möchte nach Hause."],
      ["뭐 [먹고 싶어요]?", "Was möchtest du essen?"],
      ["커피 [마시고 싶어요].", "Ich möchte Kaffee trinken."],
      ["한국어를 잘[하고 싶어요].", "Ich möchte gut Koreanisch können."],
      ["아무것도 안 [하고 싶어요].", "Ich möchte gar nichts tun."],
      ["그 영화 [보고 싶었어요].", "Den Film wollte ich sehen."]
    ] },
    "a1-12n2": { kv: true, mehr: "Endet der Stamm auf Vokal, kommt ㄹ unten an die Silbe: 가 → 갈 수 있어요. Endet er auf Konsonant, folgt 을: 먹 → 먹을 수 있어요. Die Form bedeutet Fähigkeit und Möglichkeit. Kürzer für „kann nicht“: 못 + Verb (Lektion 23).", bsp: [
      ["내일 [갈 수 있어요].", "Morgen kann ich kommen.", "가 → 갈"],
      ["매운 음식을 [먹을 수 있어요]?", "Können Sie scharf essen?", "먹 → 먹을"],
      ["혼자 [할 수 있어요].", "Das kann ich allein."],
      ["지금은 [갈 수 없어요].", "Jetzt kann ich nicht kommen."],
      ["여기서 [살 수 있어요]?", "Kann man das hier kaufen?", "사다 → 살"],
      ["한글을 [읽을 수 있어요].", "Ich kann Hangul lesen."]
    ] },
    "a1-12n3": { kv: true, mehr: "Nach Vokal und nach ㄹ steht 로, nach allen anderen Konsonanten 으로. Vier Verwendungen: Richtung (왼쪽으로), Mittel (카드로, 버스로), Sprache (한국어로) und Auswahl (이걸로).", bsp: [
      ["오른쪽[으로] 가세요.", "Gehen Sie nach rechts.", "쪽 hat unten ㄱ → 으로"],
      ["현금[으로] 계산할게요.", "Ich zahle bar."],
      ["택시[로] 왔어요.", "Ich bin mit dem Taxi gekommen.", "시 endet auf Vokal → 로"],
      ["영어[로] 말해 주세요.", "Sagen Sie es bitte auf Englisch."],
      ["이쪽[으로] 오세요.", "Kommen Sie bitte hier entlang."]
    ] },
    // ---------- Lektion 13 ----------
    "a1-13n1": { mehr: "Form: höfliche Gegenwart ohne 요 + 도 돼요. Antwort ja: 네, 돼요. Antwort nein: 안 돼요.", bsp: [
      ["여기 [앉아도 돼요]?", "Darf ich mich hierher setzen?", "앉아요 → 앉아도"],
      ["사진 [찍어도 돼요]?", "Darf ich ein Foto machen?"],
      ["이거 [먹어도 돼요]?", "Darf ich das essen?"],
      ["들어[가도 돼요]?", "Darf ich hineingehen?"],
      ["창문 [열어도 돼요]?", "Darf ich das Fenster aufmachen?"],
      ["먼저 [가도 돼요]?", "Darf ich schon gehen?"]
    ] },
    "a1-13n2": { mehr: "돼요 kommt von 되다 (gehen, klappen). Man fragt damit auch nach Möglichkeit und Erlaubnis: 카드 돼요? (geht Karte?), 내일 돼요 (morgen geht). 안 돼요 ist das übliche „Nein, das geht nicht“.", bsp: [
      ["와이파이가 [안 돼요].", "Das WLAN geht nicht."],
      ["예약 [돼요]?", "Kann man reservieren?"],
      ["오늘은 [안 돼요].", "Heute geht es nicht."],
      ["포장 [돼요]?", "Geht das zum Mitnehmen?"],
      ["이 카드는 [안 돼요].", "Diese Karte geht nicht."]
    ] },
    "a1-13n3": { kv: true, mehr: "Dieselbe Partikel wie bei der Richtung (Lektion 12). Nach Vokal oder ㄹ steht 로, sonst 으로.", bsp: [
      ["이메일[로] 보낼게요.", "Ich schicke es per E-Mail."],
      ["문자[로] 알려 주세요.", "Sagen Sie mir bitte per SMS Bescheid."],
      ["전화[로] 예약했어요.", "Ich habe telefonisch reserviert."],
      ["앱[으로] 주문했어요.", "Ich habe über die App bestellt.", "앱 hat unten ㅂ → 으로"],
      ["휴대폰[으로] 결제해요.", "Ich zahle mit dem Handy."]
    ] },
    "a1-13n4": { kv: true, mehr: "Nur für „ich“ und nur für das, was ich selbst entscheide – als Antwort auf die Lage oder den Wunsch des anderen. Stamm auf Vokal: ㄹ unten an die Silbe + 게요 (하 → 할게요). Stamm auf Konsonant: 을게요 (먹 → 먹을게요). Gesprochen klingt es wie [께요].", bsp: [
      ["내일 [전화할게요].", "Ich rufe morgen an."],
      ["금방 [갈게요].", "Ich komme gleich."],
      ["이따가 [보낼게요].", "Ich schicke es nachher."],
      ["잘 [먹을게요].", "Danke, ich lasse es mir schmecken.", "먹 endet auf Konsonant → 을게요"],
      ["여기서 [기다릴게요].", "Ich warte hier."],
      ["제가 [살게요].", "Ich lade ein.", "사다 (kaufen) → 살게요"]
    ] },
    // ---------- Lektion 14 ----------
    "a1-14n1": { mehr: "걸로 ist die Kurzform von 것으로 („das … Ding“ + 으로). 할게요 heißt „ich nehme“ (für mich entschieden), 주세요 heißt „geben Sie mir“.", bsp: [
      ["저는 비빔밥[으로 할게요].", "Ich nehme Bibimbap."],
      ["아이스[로 주세요].", "Bitte eisgekühlt."],
      ["큰 [걸로 주세요].", "Das Große, bitte."],
      ["이[걸로] 두 개 주세요.", "Davon zwei, bitte."],
      ["뭘[로 할까요]?", "Was nehmen wir?"]
    ] },
    "a1-14n2": { mehr: "빼다 heißt herausnehmen. Für „bitte nicht hineingeben“ sagt man auch 넣지 마세요. Bei einer Unverträglichkeit ist 못 먹어요 (kann ich nicht essen) deutlicher.", bsp: [
      ["고수 [빼 주세요].", "Ohne Koriander, bitte."],
      ["양파 [빼 주세요].", "Ohne Zwiebel, bitte."],
      ["치즈 [추가해 주세요].", "Bitte mit extra Käse."],
      ["밥 [추가] 돼요?", "Kann man Reis nachbestellen?"],
      ["설탕 [넣지 마세요].", "Bitte keinen Zucker hineingeben."]
    ] },
    "a1-14n3": { mehr: "필요해요 heißt „wird gebraucht“, 필요 없어요 „wird nicht gebraucht“. Das Ding steht ohne Partikel oder mit 이/가 davor.", bsp: [
      ["젓가락 [필요 없어요].", "Stäbchen brauche ich nicht."],
      ["영수증 [필요 없어요].", "Den Beleg brauche ich nicht."],
      ["봉투 [필요해요].", "Ich brauche ein Sackerl."],
      ["더 [필요해요]?", "Brauchen Sie noch mehr?"],
      ["[괜찮아요].", "Nein, danke.", "die häufigste höfliche Ablehnung"]
    ] },
    "a1-14n4": { mehr: "Das Personal fragt meist ehrend: 드시고 가세요? Die Antwort darf kurz sein. -고 verbindet zwei Handlungen: essen und dann gehen.", bsp: [
      ["[드시고 가세요]?", "Essen Sie hier?", "so fragt das Personal"],
      ["[먹고 갈게요].", "Ich esse hier."],
      ["[포장]이에요.", "Zum Mitnehmen."],
      ["[가져갈게요].", "Ich nehme es mit."],
      ["하나는 [포장해 주세요].", "Eines bitte einpacken."]
    ] },
    // ---------- Lektion 15 ----------
    "a1-15n1": { mehr: "Für Orte 에서 … 까지, für Zeiten 부터 … 까지 (아홉 시부터 여섯 시까지). 까지 allein heißt „bis“.", bsp: [
      ["집[에서] 회사[까지] 삼십 분 걸려요.", "Von zu Hause bis zur Firma dauert es 30 Minuten."],
      ["여기[에서] 멀어요?", "Ist es weit von hier?"],
      ["몇 시[까지] 해요?", "Bis wann haben Sie offen?"],
      ["서울[에서] 부산[까지] 가요.", "Ich fahre von Seoul nach Busan."],
      ["내일[까지] 기다릴게요.", "Ich warte bis morgen."]
    ] },
    "a1-15n2": { mehr: "Stunden als Dauer: koreanische Reihe + 시간 (한 시간, 두 시간). Minuten: 분 mit der anderen Reihe.", bsp: [
      ["시간이 [얼마나 걸려요]?", "Wie lange dauert es?"],
      ["한 시간 [걸려요].", "Es dauert eine Stunde."],
      ["택시로 이십 분 [걸려요].", "Mit dem Taxi dauert es 20 Minuten."],
      ["오래 [걸려요]?", "Dauert es lange?"],
      ["얼마 안 [걸려요].", "Es dauert nicht lange."]
    ] },
    "a1-15n3": { mehr: "번 hat zwei Verwendungen: Nummer (mit 일, 이, 삼) und „Mal“ (mit 한, 두, 세).", bsp: [
      ["[몇 번] 버스예요?", "Welche Buslinie ist es?"],
      ["[구 번] 출구로 나오세요.", "Kommen Sie bei Ausgang 9 heraus."],
      ["[백 번] 버스를 타세요.", "Nehmen Sie den Bus Nummer 100."],
      ["[일 번]이에요.", "Es ist die Nummer eins."],
      ["[두 번] 갔어요.", "Ich war zweimal dort.", "„Mal“ zählt man mit 한, 두, 세"]
    ] },
    // ---------- Lektion 16 ----------
    "a1-16n1": { mehr: "Zwei Wege: eigene ehrende Verben (드시다, 주무시다, 계시다) oder bei allen anderen Verben -(으)시- einfügen: 가다 → 가세요, 하다 → 하세요, 했어요 → 하셨어요. Über sich selbst sagt man das nie.", bsp: [
      ["아버님, 식사 [하셨어요]?", "Vater, haben Sie schon gegessen?"],
      ["어머님, 커피 [드세요].", "Mutter, bitte, Ihr Kaffee."],
      ["할머니는 [주무세요].", "Die Großmutter schläft."],
      ["부모님은 서울에 [계세요].", "Die Eltern sind in Seoul."],
      ["어디 [가세요]?", "Wohin gehen Sie?", "-(으)세요 ehrt jede Handlung"],
      ["뭐 [드실래요]?", "Was möchten Sie essen?"]
    ] },
    "a1-16n2": { mehr: "Wie -아/어 주다 (für jemanden tun), nur ehrend: -아/어 드리다. Im Geschäft hört man es ständig vom Personal.", bsp: [
      ["선물을 [드렸어요].", "Ich habe ihnen ein Geschenk gegeben."],
      ["제가 [해 드릴게요].", "Ich mache das für Sie."],
      ["전화 [드릴게요].", "Ich rufe Sie an."],
      ["가방 [들어 드릴게요].", "Ich trage Ihnen die Tasche."],
      ["뭘 [도와 드릴까요]?", "Womit kann ich Ihnen helfen?"]
    ] },
    "a1-16n3": { mehr: "저 + 가 wird zu 제가 (nicht 저가). Vertraut heißt es 내가. 저는 bedeutet „was mich betrifft“, 제가 bedeutet „ich, und kein anderer“.", bsp: [
      ["[제가] 갈게요.", "Ich gehe."],
      ["[제가] 낼게요.", "Ich zahle."],
      ["[제가] 했어요.", "Das habe ich gemacht."],
      ["[제가] 전화할게요.", "Ich rufe an."],
      ["이건 [제가] 들게요.", "Das trage ich."]
    ] },
    "a1-16n4": { mehr: "Die Endung -습니다 / -ㅂ니다 ist förmlicher als -아요/어요. In festen Formeln bleibt sie auch in der Familie. Wer diese Sätze zur rechten Zeit sagt, gilt als gut erzogen.", bsp: [
      ["[수고하세요].", "Frohes Schaffen.", "beim Gehen, zu jemandem, der weiterarbeitet"],
      ["[실례합니다].", "Entschuldigen Sie die Störung."],
      ["[축하드립니다].", "Herzlichen Glückwunsch.", "ehrend"],
      ["[처음 뵙겠습니다].", "Sehr erfreut.", "bei der ersten Begegnung"],
      ["[잘 부탁드립니다].", "Auf gute Zusammenarbeit.", "nach der Vorstellung"],
      ["[들어가세요].", "Kommen Sie gut heim.", "wörtlich: gehen Sie hinein"]
    ] },
    // ---------- Lektion 17 ----------
    "a1-17n1": { mehr: "Aus jeder höflichen Form wird durch Weglassen von 요 die vertraute – in Gegenwart, Vergangenheit (먹었어), Frage und Aufforderung. „Ich“ heißt dann 나 statt 저, „mein“ 내 statt 제. Unter Eheleuten ist das üblich, gegenüber Schwiegereltern nie.", bsp: [
      ["뭐 [먹어]?", "Was isst du?"],
      ["어디 [가]?", "Wohin gehst du?"],
      ["나 지금 [바빠].", "Ich bin gerade beschäftigt."],
      ["이거 [맛있어].", "Das schmeckt gut."],
      ["빨리 [와].", "Komm schnell."],
      ["[고마워].", "Danke."]
    ] },
    "a1-17n2": { mehr: "자 hängt am Stamm – gleich, ob er auf Konsonant oder Vokal endet. Höflich sagt man dasselbe mit 같이 …요 oder -(으)ㄹ까요?", bsp: [
      ["빨리 [가자].", "Gehen wir schnell."],
      ["이거 [보자].", "Schauen wir uns das an."],
      ["내일 [만나자].", "Treffen wir uns morgen."],
      ["손 [씻자].", "Waschen wir die Hände."],
      ["조금만 [기다리자].", "Warten wir noch kurz."]
    ] },
    "a1-17n3": { mehr: "Die vertraute Form von -지 마세요. 지 hängt direkt am Stamm.", bsp: [
      ["[울지 마].", "Wein nicht."],
      ["[가지 마].", "Geh nicht."],
      ["그거 [만지지 마].", "Fass das nicht an."],
      ["[걱정하지 마].", "Mach dir keine Sorgen."],
      ["거기 [올라가지 마].", "Klettere dort nicht hinauf."],
      ["[싸우지 마].", "Nicht streiten."]
    ] },
    "a1-17n4": { kv: true, mehr: "Nach Konsonant 이야, nach Vokal 야. Die Verneinung heißt 아니야.", bsp: [
      ["누구[야]?", "Wer ist das?", "구 endet auf Vokal → 야"],
      ["선물[이야].", "Das ist ein Geschenk.", "물 hat unten ㄹ → 이야"],
      ["아빠 거[야].", "Das gehört Papa."],
      ["내 친구[야].", "Das ist mein Freund."],
      ["진짜[야]?", "Echt?"],
      ["[아니야].", "Nein, stimmt nicht."]
    ] },
    // ---------- Lektion 18 ----------
    "a1-18n1": { mehr: "Gesprochen wird 그런데 oft zu 근데 verkürzt. 그래서 verbindet Grund und Folge zwischen zwei Sätzen. Innerhalb eines Satzes übernimmt das später -아/어서 (A2).", bsp: [
      ["[왜] 안 먹어요?", "Warum isst du nicht?"],
      ["피곤해요. [그래서] 일찍 자요.", "Ich bin müde. Deshalb gehe ich früh schlafen."],
      ["비가 와요. [그래서] 집에 있어요.", "Es regnet. Deshalb bin ich zu Hause."],
      ["맛있어요. [그런데] 좀 매워요.", "Es schmeckt gut. Aber es ist etwas scharf."],
      ["[그런데] 지금 몇 시예요?", "Übrigens, wie spät ist es?"]
    ] },
    "a1-18n2": { mehr: "도 steht direkt hinter dem Wort, das mit „auch“ gemeint ist, und ersetzt dort 은/는, 이/가, 을/를. Nach 에 und 에서 bleibt die Partikel, 도 kommt dazu (집에서도).", bsp: [
      ["저[도] 가요.", "Ich gehe auch."],
      ["이것[도] 주세요.", "Das hier auch, bitte."],
      ["내일[도] 일해요.", "Morgen arbeite ich auch."],
      ["저[도] 몰라요.", "Ich weiß es auch nicht."],
      ["커피[도] 마시고 차[도] 마셔요.", "Ich trinke Kaffee und auch Tee."]
    ] },
    "a1-18n3": { mehr: "Für den Eindruck von Dingen, Orten und Geschenken. Für dauerhaftes Mögen sagt man 좋아해요.", bsp: [
      ["이 색깔 [마음에 들어요].", "Diese Farbe gefällt mir."],
      ["선물 [마음에 들어요]?", "Gefällt dir das Geschenk?"],
      ["별로 [마음에 안 들어요].", "Es gefällt mir nicht besonders."],
      ["그 식당 [마음에 들었어요].", "Das Lokal hat mir gefallen."],
      ["정말 [마음에 들어요].", "Es gefällt mir wirklich."]
    ] },
    // ---------- Lektion 19 ----------
    "a1-19n1": { kv: true, mehr: "Stamm auf Vokal: ㄹ unten an die Silbe (가 → 갈 거예요). Stamm auf Konsonant: 을 거예요 (먹 → 먹을 거예요). Für Pläne und Vermutungen. Der Unterschied zu -(으)ㄹ게요: Das ist eine Zusage an den anderen, 거예요 ein Plan oder eine Vorhersage.", bsp: [
      ["내일 비가 [올 거예요].", "Morgen wird es regnen.", "오 → 올"],
      ["주말에 영화를 [볼 거예요].", "Am Wochenende schaue ich einen Film."],
      ["저녁에 뭐 [먹을 거예요]?", "Was isst du am Abend?", "먹 → 먹을"],
      ["일월에 한국에 [갈 거예요].", "Im Jänner fliege ich nach Korea."],
      ["곧 [끝날 거예요].", "Es ist bald vorbei."],
      ["괜찮[을 거예요].", "Es wird schon gut gehen."]
    ] },
    "a1-19n2": { kv: true, mehr: "Mit „wir“ ist es ein Vorschlag, mit „ich“ ein Angebot (soll ich …?). Die Bildung ist dieselbe wie bei -(으)ㄹ 거예요.", bsp: [
      ["같이 [갈까요]?", "Gehen wir zusammen?"],
      ["뭐 [먹을까요]?", "Was sollen wir essen?"],
      ["여기 [앉을까요]?", "Setzen wir uns hierher?"],
      ["택시 [탈까요]?", "Nehmen wir ein Taxi?"],
      ["조금 [쉴까요]?", "Machen wir eine kleine Pause?"],
      ["창문 [열까요]?", "Soll ich das Fenster aufmachen?"]
    ] },
    "a1-19n3": { mehr: "Fragt nach Meinung oder Zustand. Vergangenheit: 어땠어요? (Wie war es?)", bsp: [
      ["이 식당 [어때요]?", "Wie ist dieses Lokal?"],
      ["한국 음식 [어때요]?", "Wie findest du koreanisches Essen?"],
      ["내일 저녁 [어때요]?", "Wie wäre morgen Abend?"],
      ["요즘 [어때요]?", "Wie geht es dir zurzeit?"],
      ["맛이 [어때요]?", "Wie schmeckt es?"]
    ] },
    "a1-19n4": { kv: true, mehr: "Koreaner sagen selten hart „es ist so“, wenn es nur eine Einschätzung ist. Mit 것 같아요 klingt auch eine Absage oder schlechte Nachricht weicher. Bildung wie -(으)ㄹ 거예요.", bsp: [
      ["비가 [올 것 같아요].", "Es wird wohl regnen."],
      ["오늘은 못 [갈 것 같아요].", "Heute schaffe ich es wohl nicht."],
      ["맛있[을 것 같아요].", "Das schmeckt bestimmt gut."],
      ["시간이 [걸릴 것 같아요].", "Das wird wohl dauern."],
      ["괜찮[을 것 같아요].", "Das passt wohl."]
    ] },
    // ---------- Lektion 20 ----------
    "a1-20n1": { mehr: "Form: höfliche Gegenwart ohne 요 + 야 해요 (가요 → 가야 해요). Gleichbedeutend und im Alltag sogar häufiger: -아/어야 돼요.", bsp: [
      ["지금 [가야 해요].", "Ich muss jetzt gehen."],
      ["약을 [먹어야 해요].", "Ich muss das Medikament nehmen."],
      ["일찍 [일어나야 해요].", "Ich muss früh aufstehen."],
      ["예약[해야 해요]?", "Muss man reservieren?"],
      ["여기서 [갈아타야 해요].", "Hier muss man umsteigen."],
      ["내일까지 [해야 돼요].", "Ich muss es bis morgen machen.", "돼요 statt 해요"]
    ] },
    "a1-20n2": { mehr: "부터 steht hinter dem Zeitpunkt. Zusammen mit 까지: von … bis.", bsp: [
      ["내일[부터] 휴가예요.", "Ab morgen habe ich Urlaub."],
      ["몇 시[부터] 해요?", "Ab wann haben Sie offen?"],
      ["월요일[부터] 금요일까지 일해요.", "Ich arbeite von Montag bis Freitag."],
      ["오늘[부터] 운동할 거예요.", "Ab heute mache ich Sport."],
      ["처음[부터] 다시 해요.", "Machen wir es noch einmal von vorne."]
    ] },
    "a1-20n3": { mehr: "Beschwerden werden mit eigenen Verben beschrieben, nicht mit „haben“: Eine Krankheit bleibt hängen (걸려요), Fieber, Husten und Schnupfen kommen heraus (나요).", bsp: [
      ["아이가 감기에 [걸렸어요].", "Das Kind ist erkältet."],
      ["열이 많이 [나요].", "Ich habe hohes Fieber."],
      ["기침이 [나요].", "Ich habe Husten."],
      ["콧물이 [나요].", "Mir rinnt die Nase."],
      ["배탈이 [났어요].", "Ich habe mir den Magen verdorben."]
    ] },
    "a1-20n4": { mehr: "Zeitraum + 에 + Anzahl + 번 heißt „so oft pro …“.", bsp: [
      ["[하루에 두 번] 먹어요.", "Ich nehme es zweimal am Tag."],
      ["[일주일에 한 번] 운동해요.", "Ich mache einmal pro Woche Sport."],
      ["[한 달에 한 번] 가요.", "Ich gehe einmal im Monat hin."],
      ["[일 년에 두 번] 한국에 가요.", "Ich fliege zweimal im Jahr nach Korea."],
      ["[하루에] 커피 세 잔 마셔요.", "Ich trinke drei Tassen Kaffee am Tag."]
    ] },
    // ---------- Lektion 21 ----------
    "a1-21n1": { mehr: "좀 ist die Kurzform von 조금. In Bitten bedeutet es kaum noch „ein bisschen“, sondern wirkt wie unser „bitte mal“.", bsp: [
      ["물 [좀] 주세요.", "Etwas Wasser, bitte."],
      ["[좀] 도와주세요.", "Helfen Sie mir bitte."],
      ["이거 [좀] 들어 주세요.", "Halten Sie das bitte kurz."],
      ["시간 [좀] 있어요?", "Hast du kurz Zeit?"],
      ["소리 [좀] 줄여 주세요.", "Bitte etwas leiser."],
      ["[좀] 비싸요.", "Es ist etwas teuer.", "hier wirklich: ein bisschen"]
    ] },
    "a1-21n2": { mehr: "Für fast jede Störung reicht eines der Muster: geht nicht (안 돼요), kommt nicht (안 나와요), ist kaputt (고장 났어요). Dazu ein paar feste Wendungen.", bsp: [
      ["카드가 [안 돼요].", "Die Karte geht nicht."],
      ["문이 [안 열려요].", "Die Tür geht nicht auf."],
      ["불이 [안 켜져요].", "Das Licht geht nicht an."],
      ["에어컨이 [고장 났어요].", "Die Klimaanlage ist kaputt."],
      ["변기가 [막혔어요].", "Die Toilette ist verstopft."],
      ["물이 [새요].", "Es tropft Wasser."]
    ] },
    "a1-21n3": { kv: true, mehr: "제가 betont, dass ich es übernehme. -(으)ㄹ게요 ist die Zusage: Stamm auf Vokal → ㄹ unten an die Silbe + 게요, Stamm auf Konsonant → 을게요.", bsp: [
      ["제가 [청소할게요].", "Ich putze."],
      ["제가 [버릴게요].", "Ich bringe den Müll weg."],
      ["빨래는 제가 [할게요].", "Die Wäsche mache ich."],
      ["제가 [요리할게요].", "Ich koche."],
      ["아이는 제가 [볼게요].", "Auf das Kind passe ich auf."]
    ] },
    // ---------- Lektion 22 ----------
    "a1-22n1": { mehr: "Zwei Bedeutungen: etwas ausprobieren (입어 보세요) und, in der Vergangenheit, etwas schon einmal gemacht haben (가 봤어요).", bsp: [
      ["이거 [먹어 보세요].", "Probieren Sie das."],
      ["한번 [해 보세요].", "Versuchen Sie es einmal."],
      ["김치 [먹어 봤어요]?", "Haben Sie schon einmal Kimchi gegessen?"],
      ["한국에 [가 봤어요].", "Ich war schon einmal in Korea."],
      ["[신어 봐도 돼요]?", "Darf ich die Schuhe anprobieren?"],
      ["다시 [생각해 볼게요].", "Ich überlege es mir noch einmal."]
    ] },
    "a1-22n2": { mehr: "더 heißt „mehr“ und steht vor dem Eigenschaftswort oder Verb. „Als“ heißt 보다 und steht hinter dem Vergleichswort. Das Gegenteil von 더 ist 덜 (weniger).", bsp: [
      ["[더] 싼 거 있어요?", "Haben Sie etwas Billigeres?"],
      ["이게 [더] 좋아요.", "Das hier ist besser."],
      ["조금 [더] 주세요.", "Noch etwas mehr, bitte."],
      ["[더] 천천히 말해 주세요.", "Sprechen Sie bitte langsamer."],
      ["어제보다 [더] 추워요.", "Es ist kälter als gestern.", "보다 = als"],
      ["[덜] 매운 거 있어요?", "Gibt es etwas weniger Scharfes?"]
    ] },
    "a1-22n3": { kv: true, mehr: "Stamm auf Vokal: ㄴ unten an die Silbe (크 → 큰, 예쁘 → 예쁜). Stamm auf Konsonant: 은 (작 → 작은, 좋 → 좋은). Wörter mit ㅂ: 매운, 더운, 추운. Wörter auf 있다 und 없다 nehmen 는: 맛있는, 재미없는.", bsp: [
      ["[작은] 사이즈 주세요.", "Eine kleine Größe, bitte.", "작 endet auf Konsonant → 은"],
      ["[좋은] 생각이에요.", "Das ist eine gute Idee."],
      ["[예쁜] 옷이에요.", "Das ist ein hübsches Kleidungsstück.", "예쁘 endet auf Vokal → ㄴ"],
      ["[매운] 음식 좋아해요?", "Magst du scharfes Essen?", "맵다: ㅂ → 우 → 매운"],
      ["[맛있는] 식당 알아요?", "Kennst du ein gutes Lokal?", "있다 → 있는"],
      ["[따뜻한] 물 주세요.", "Warmes Wasser, bitte."]
    ] },
    "a1-22n4": { mehr: "Die Farbwörter enden auf 색 (Farbe). Mit (으)로 wählt man aus, mit 이/가 sagt man, was einem gefällt.", bsp: [
      ["[흰색] 있어요?", "Haben Sie es in Weiß?"],
      ["[파란색]이 좋아요.", "Blau gefällt mir."],
      ["[빨간색]으로 할게요.", "Ich nehme es in Rot."],
      ["무슨 [색]이에요?", "Welche Farbe ist es?"],
      ["[검은색] 바지를 샀어요.", "Ich habe eine schwarze Hose gekauft."]
    ] },
    // ---------- Lektion 23 ----------
    "a1-23n1": { mehr: "못 heißt: Es geht nicht – keine Fähigkeit, keine Möglichkeit, etwas hindert mich. 안 heißt: Ich tue es nicht. Als Absage klingt 못 가요 höflicher als 안 가요.", bsp: [
      ["오늘은 [못] 가요.", "Heute kann ich nicht kommen."],
      ["매운 음식을 [못] 먹어요.", "Scharfes Essen kann ich nicht essen."],
      ["어제 [못] 잤어요.", "Gestern konnte ich nicht schlafen."],
      ["운전 [못] 해요.", "Ich kann nicht Auto fahren.", "bei 하다 nach dem Nomen"],
      ["술을 [못] 마셔요.", "Ich vertrage keinen Alkohol."],
      ["아직 [못] 했어요.", "Ich habe es noch nicht geschafft."]
    ] },
    "a1-23n2": { mehr: "Für das, was genau jetzt läuft. Im Alltag reicht oft die einfache Gegenwart (지금 먹어요). Ehrend: -고 계세요.", bsp: [
      ["지금 밥 [먹고 있어요].", "Ich esse gerade."],
      ["뭐 [하고 있어요]?", "Was machst du gerade?"],
      ["아이가 [자고 있어요].", "Das Kind schläft gerade."],
      ["비가 [오고 있어요].", "Es regnet gerade."],
      ["[기다리고 있어요].", "Ich warte."],
      ["지금 [가고 있어요].", "Ich bin unterwegs."]
    ] },
    "a1-23n3": { mehr: "Dieselbe Partikel (으)로 wie bei Richtung und Mittel. Sprachen enden auf 어 – also immer 로.", bsp: [
      ["[영어로] 뭐예요?", "Wie heißt das auf Englisch?"],
      ["[독일어로] 말해도 돼요?", "Darf ich Deutsch sprechen?"],
      ["[한국어로] 써 주세요.", "Schreiben Sie es bitte auf Koreanisch."],
      ["이거 [한국어로] 어떻게 말해요?", "Wie sagt man das auf Koreanisch?"],
      ["[한국어로] 이야기해요.", "Sprechen wir Koreanisch."]
    ] },
    "a1-23n4": { mehr: "-네요 drückt aus, dass man etwas gerade bemerkt und darüber staunt. Auf Lob antwortet man bescheiden mit 아니에요. Ein bloßes „Danke“ kann eingebildet wirken.", bsp: [
      ["맛있[네요]!", "Das schmeckt aber gut!"],
      ["비싸[네요].", "Das ist ja teuer."],
      ["벌써 왔[네요].", "Sie sind ja schon da."],
      ["아이가 많이 컸[네요].", "Das Kind ist aber gewachsen."],
      ["[아니에요], 아직 잘 못해요.", "Ach nein, ich kann es noch nicht gut."]
    ] },
    // ---------- Lektion 24 ----------
    "a1-24n1": { mehr: "Diese Wörter stehen vor dem Verb oder am Satzanfang. 별로 und 전혀 brauchen immer eine Verneinung.", bsp: [
      ["[항상] 바빠요.", "Ich bin immer beschäftigt."],
      ["[자주] 만나요.", "Wir treffen uns oft."],
      ["[보통] 일곱 시에 일어나요.", "Normalerweise stehe ich um sieben auf."],
      ["[가끔] 술을 마셔요.", "Manchmal trinke ich Alkohol."],
      ["[별로] 안 비싸요.", "Es ist nicht besonders teuer."],
      ["[전혀] 안 매워요.", "Es ist überhaupt nicht scharf."]
    ] },
    "a1-24n2": { mehr: "는 것 macht aus einem Verb ein Nomen („das Kochen“). Danach folgen die normalen Partikeln: 것을 (gesprochen kurz 걸) oder 것이 (kurz 게).", bsp: [
      ["걷[는 것]을 좋아해요.", "Ich gehe gern zu Fuß."],
      ["책 읽[는 것]을 좋아해요.", "Ich lese gern."],
      ["요리하[는 것]이 재미있어요.", "Kochen macht Spaß."],
      ["한국어 배우[는 것]이 어려워요.", "Koreanisch zu lernen ist schwierig."],
      ["사진 찍[는 걸] 좋아해요.", "Ich fotografiere gern.", "것을 → 걸"]
    ] },
    "a1-24n3": { mehr: "Eigenschaftswörter bilden die Vergangenheit wie Verben: 요 weg, ㅆ어요 dran. Auch die unregelmäßigen: 바쁘다 → 바빴어요, 덥다 → 더웠어요.", bsp: [
      ["날씨가 [좋았어요].", "Das Wetter war schön."],
      ["음식이 [맛있었어요].", "Das Essen war gut."],
      ["어제는 [바빴어요].", "Gestern war ich beschäftigt."],
      ["여행이 [어땠어요]?", "Wie war die Reise?"],
      ["조금 [힘들었어요].", "Es war etwas anstrengend."],
      ["영화가 [재미없었어요].", "Der Film war langweilig."]
    ] }
  }
});
