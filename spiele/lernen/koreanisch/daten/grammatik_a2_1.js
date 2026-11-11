// grammatik_a2_1.js — Grammatikteil zu A2, Teil 1 (Lektionen a2-01 … a2-12): zwei Übersichtsseiten und zu jeder Regel
// eine genauere Erklärung mit Beispielen. Aufbau und Regeln wie in grammatik.js: Beispiele nur ANS ENDE anhängen,
// nichts umreihen, nichts löschen (stilllegen mit null). Kennung eines Beispiels = Schlüssel + "b" + Platz.
// kv: "stamm" = die Form hängt davon ab, ob der Verbstamm auf Konsonant oder Vokal endet (Hinweiskasten mit Stämmen als Beispiel).
KO.grammatik({
  grund: [
    { id: "g-anschluss", titel: "Endungen anhängen: drei Muster", kurz: "Woran eine Endung hängt – am Stamm, am Stamm mit 으 oder an der 아/어-Form.",
      text: [
        "Fast jede Endung ab A2 folgt einem von drei Mustern. Wer das Muster kennt, muss die Endung nicht einzeln lernen.",
        "Der Stamm ist die Grundform ohne 다 (먹다 → 먹, 가다 → 가). Die 아/어-Form ist die höfliche Gegenwart ohne 요 (먹어요 → 먹어, 가요 → 가, 해요 → 해)."
      ],
      tabelle: [
        ["Woran die Endung hängt", "Endungen", "Beispiel"],
        ["1 · direkt am Stamm, nichts ändert sich", "-고 · -지만 · -기 전에 · -고 나서 · -기로 했어요 · -지 않아요 · -지요 · -거든요 · -겠어요 · -게", "먹고 가고"],
        ["2 · am Stamm; nach Konsonant schiebt sich 으 dazwischen", "-(으)면 · -(으)니까 · -(으)려고 · -(으)러 · -(으)면서 · -(으)ㄹ 때 · -(으)ㄴ 후에 · -(으)ㄹ래요 · -(으)ㄹ 줄 알아요 · -(으)ㄴ 적이 있어요", "먹으면 가면"],
        ["3 · an der 아/어-Form", "-아서/어서 · -아도/어도 · -아져요 · -아 보여요 · -아 봤어요 · -아 주세요 · -아야 해요 · -았어요", "먹어서 가서"]
      ],
      danach: [
        "Unregelmäßige Verben ändern ihren Stamm nur bei Muster 2 und 3, weil dort ein Vokal folgt: 듣다 → 들으면, 들어서 · 덥다 → 더우면, 더워서. Bei Muster 1 bleibt der Stamm: 듣고, 덥지만.",
        "Sonderfall Stamm auf ㄹ (살다, 만들다, 놀다, 알다, 멀다): Bei Muster 2 kommt kein 으 (살면, 만들려고, 놀러). Vor ㄴ, ㅂ und ㅅ fällt das ㄹ weg (사는, 사니까, 삽니다, 사세요). Bei -(으)ㄹ bleibt ein einziges ㄹ (살 때, 만들 줄 알아요)."
      ],
      bsp: [
        ["비가 [오고] 바람이 불어요.", "Es regnet und der Wind weht.", "Muster 1: 오 + 고"],
        ["비가 [오면] 안 가요.", "Wenn es regnet, gehe ich nicht.", "Muster 2: 오 + 면"],
        ["비가 [와서] 안 갔어요.", "Weil es geregnet hat, bin ich nicht gegangen.", "Muster 3: 와요 → 와서"],
        ["음악을 [듣고] 쉬어요.", "Ich höre Musik und ruhe mich aus.", "Muster 1: 듣 bleibt"],
        ["음악을 [들으면] 시간이 빨리 가요.", "Wenn ich Musik höre, vergeht die Zeit schnell.", "Muster 2: 듣 → 들으면"],
        ["음악을 [들어서] 기분이 좋아졌어요.", "Ich habe Musik gehört, jetzt geht es mir besser.", "Muster 3: 들어요 → 들어서"],
        ["한국에 [살면] 좋겠어요.", "Es wäre schön, in Korea zu leben.", "Stamm auf ㄹ: kein 으"],
        ["한국에 [사는] 친구가 있어요.", "Ich habe einen Freund, der in Korea lebt.", "Stamm auf ㄹ: ㄹ fällt vor ㄴ weg"]
      ],
      siehe: ["a2-01n1", "a2-01n2", "a2-02n1", "a2-03n1", "a2-04n4", "a2-05n1", "a2-07n3", "g-unreg", "g-gegenwart"] },

    { id: "g-vornomen", titel: "Beschreibung vor dem Nomen: 는 · (으)ㄴ · (으)ㄹ", kurz: "Wie aus einem Satz eine Beschreibung wird – und in welchen Formen sie überall steckt.",
      text: [
        "Im Deutschen steht die nähere Beschreibung hinter dem Nomen: „das Essen, das ich mag“. Im Koreanischen steht sie davor, und ihr Verb bekommt eine von drei Endungen: 제가 좋아하는 음식.",
        "Welche Endung, hängt von der Zeit ab – und davon, ob es ein Verb oder ein Eigenschaftswort ist."
      ],
      tabelle: [
        ["", "Verb", "Eigenschaftswort"],
        ["jetzt, immer", "는: 먹는 · 가는", "(으)ㄴ: 작은 · 큰"],
        ["vorbei", "(으)ㄴ: 먹은 · 간", "– (kommt in B1)"],
        ["kommt noch, möglich", "(으)ㄹ: 먹을 · 갈", "(으)ㄹ: 작을 · 클"],
        ["있다 · 없다", "는: 있는 · 없는 · 맛있는", ""]
      ],
      danach: [
        "Vorsicht: (으)ㄴ bedeutet beim Verb „vorbei“ (먹은 음식 = das Essen, das ich gegessen habe), beim Eigenschaftswort „jetzt“ (작은 집 = ein kleines Haus).",
        "In der Beschreibung steht die handelnde Person mit 이/가, nicht mit 은/는: 제가 만든 음식, 아내가 좋아하는 노래.",
        "Dieselben drei Formen stecken in vielen festen Mustern: 는 것 같아요 (scheint), (으)ㄴ 적이 있어요 (schon einmal), (으)ㄴ 후에 (nachdem), (으)ㄹ 때 (als, wenn), (으)ㄹ 줄 알아요 (können), (으)ㄹ 거예요 (Zukunft), (으)ㄹ 수 있어요 (können)."
      ],
      bsp: [
        ["지금 [먹는] 음식", "das Essen, das ich gerade esse", "Verb, jetzt → 는"],
        ["어제 [먹은] 음식", "das Essen, das ich gestern gegessen habe", "Verb, vorbei → 은"],
        ["내일 [먹을] 음식", "das Essen, das ich morgen essen werde", "Verb, kommt noch → 을"],
        ["[매운] 음식", "scharfes Essen", "Eigenschaftswort: 맵다 → 매운"],
        ["[맛있는] 음식", "gutes Essen", "있다 und 없다 immer mit 는"],
        ["제가 [만든] 음식", "das Essen, das ich gekocht habe", "만들다: ㄹ fällt weg → 만든"]
      ],
      siehe: ["a1-22n3", "a2-08n1", "a2-08n2", "a2-08n3", "a2-08n4", "a2-09n1", "a2-06n1", "a2-04n2", "a2-03n2"] }
  ],

  regeln: {
    // ---------- a2-01 Gründe nennen ----------
    "a2-01n1": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 서 (가요 → 가서, 먹어요 → 먹어서, 해요 → 해서, 바빠요 → 바빠서, 더워요 → 더워서). Vor 서 steht nie eine Vergangenheit; die Zeit zeigt nur das Satzende. Nach -아서/어서 folgt keine Bitte, keine Aufforderung und kein Vorschlag – dafür nimmt man -(으)니까. Bei Dank und Entschuldigung ist -아서/어서 die übliche Form.", verweis: "g-anschluss", bsp: [
      ["배가 [아파서] 병원에 갔어요.", "Ich hatte Bauchweh und bin deshalb zum Arzt gegangen.", "아파요 → 아파서; Vergangenheit nur am Ende"],
      ["너무 [매워서] 못 먹어요.", "Es ist zu scharf, ich kann es nicht essen.", "매워요 → 매워서"],
      ["[도와줘서] 고마워요.", "Danke, dass du geholfen hast."],
      ["[만나서] 반갑습니다.", "Freut mich, Sie kennenzulernen.", "wörtlich: weil ich Sie treffe, freue ich mich"],
      ["길이 [막혀서] 좀 늦을 것 같아요.", "Es staut, ich komme wohl etwas später."],
      ["돈이 [없어서] 못 샀어요.", "Ich hatte kein Geld und konnte es nicht kaufen."]
    ] },
    "a2-01n2": { kv: "stamm", mehr: "Bildung: Stamm + 니까, nach Konsonant 으니까. Man nimmt es, wenn nach dem Grund eine Bitte, eine Aufforderung oder ein Vorschlag kommt (-(으)세요, -(으)ㄹ까요, -아요 als Vorschlag). Anders als bei -아서 darf davor eine Vergangenheit stehen (먹었으니까). Unregelmäßig: 덥다 → 더우니까, 듣다 → 들으니까, 멀다 → 머니까 (ㄹ fällt weg). Als Begründung klingt -(으)니까 nachdrücklich; bei Entschuldigungen nimmt man deshalb -아서.", verweis: "g-anschluss", bsp: [
      ["[더우니까] 창문을 열까요?", "Es ist heiß – sollen wir das Fenster aufmachen?", "덥다 → 더우니까"],
      ["[늦었으니까] 택시를 타요.", "Es ist spät geworden, nehmen wir ein Taxi.", "Vergangenheit ist hier erlaubt"],
      ["아이가 [자니까] 조용히 해 주세요.", "Das Kind schläft, seien Sie bitte leise.", "자 endet auf Vokal → 니까"],
      ["[맛있으니까] 한번 먹어 보세요.", "Es schmeckt gut, probieren Sie einmal.", "있 hat unten ㅆ → 으니까"],
      ["내일은 [바쁘니까] 오늘 만나요.", "Morgen habe ich viel zu tun, treffen wir uns heute."],
      ["집이 [머니까] 일찍 출발하세요.", "Sie wohnen weit weg, fahren Sie früh los.", "멀다: ㄹ fällt vor 니까 weg"]
    ] },
    "a2-01n3": { mehr: "때문에 steht direkt hinter dem Nomen, ohne Partikel dazwischen. Meist geht es um etwas, das stört oder hindert. Bei einem erfreulichen Grund sagt man 덕분에 (dank). Als kurze Antwort auf 왜요? reicht: Nomen + 때문에요. Mit einem Verb heißt es -기 때문에; das klingt eher geschrieben, im Gespräch nimmt man -아서.", bsp: [
      ["눈 [때문에] 길이 막혀요.", "Wegen des Schnees staut es."],
      ["모기 [때문에] 잠을 못 잤어요.", "Wegen der Gelsen konnte ich nicht schlafen."],
      ["저 [때문에] 늦었어요. 미안해요.", "Wegen mir sind wir zu spät. Tut mir leid."],
      ["회의 [때문에요].", "Wegen der Besprechung.", "kurze Antwort auf 왜요?"],
      ["[덕분에] 잘 지내요.", "Dank Ihnen geht es mir gut.", "erfreulicher Grund: 덕분에"]
    ] },
    "a2-01n4": { mehr: "Hier verbindet -아서/어서 zwei Schritte, die zusammengehören: Man geht irgendwohin und tut dort etwas, oder man macht etwas und verwendet das Ergebnis weiter. Typisch nach 가다, 오다, 만나다, 사다, 만들다, 앉다, 일어나다. Beide Teile haben dieselbe handelnde Person. Zum Vergleich: -고 reiht zwei Handlungen nur lose aneinander (밥 먹고 커피 마셔요).", bsp: [
      ["집에 [가서] 쉴게요.", "Ich gehe heim und ruhe mich aus."],
      ["여기 [앉아서] 기다리세요.", "Setzen Sie sich hierher und warten Sie."],
      ["김밥을 [사서] 공원에서 먹었어요.", "Ich habe Kimbap gekauft und im Park gegessen.", "das Gekaufte wird gegessen"],
      ["친구를 [만나서] 영화를 봤어요.", "Ich habe einen Freund getroffen und mit ihm einen Film gesehen."],
      ["아침에 [일어나서] 물을 마셔요.", "In der Früh stehe ich auf und trinke Wasser."],
      ["사진을 [찍어서] 보내 주세요.", "Machen Sie ein Foto und schicken Sie es mir."]
    ] },

    // ---------- a2-02 Aber, und, übrigens ----------
    "a2-02n1": { mehr: "-지만 hängt direkt am Stamm, egal ob dieser auf Konsonant oder Vokal endet. Vergangenheit: -았지만 / -었지만. Als eigenes Wort am Satzanfang heißt es 하지만, gesprochen meist 근데. Sehr nützlich sind die höflichen Einleitungen 죄송하지만 und 실례지만.", bsp: [
      ["한국어는 [어렵지만] 재미있어요.", "Koreanisch ist schwer, aber es macht Spaß."],
      ["[피곤하지만] 운동하러 가요.", "Ich bin müde, gehe aber zum Sport."],
      ["많이 [먹었지만] 아직 배고파요.", "Ich habe viel gegessen, habe aber noch Hunger.", "Vergangenheit: 먹었 + 지만"],
      ["[죄송하지만] 다시 말해 주세요.", "Entschuldigung, sagen Sie es bitte noch einmal.", "höfliche Einleitung"],
      ["[실례지만] 누구세요?", "Verzeihung, wer sind Sie?"],
      ["집은 [작지만] 편해요.", "Die Wohnung ist klein, aber gemütlich."]
    ] },
    "a2-02n2": { kv: "stamm", mehr: "Welche Form: Verben sowie 있다 und 없다 bekommen 는데 (가는데, 먹는데, 없는데). Eigenschaftswörter bekommen ㄴ데, nach Konsonant 은데 (바쁜데, 좋은데). Nomen: 인데. In der Vergangenheit immer -았는데 / -었는데. Was es leistet: Es liefert den Hintergrund, bevor die eigentliche Frage, Bitte oder Feststellung kommt. Je nach Zusammenhang übersetzt man es mit „und“, „aber“, einem Gedankenstrich oder gar nicht. Unregelmäßig: 덥다 → 더운데, 멀다 → 먼데, 살다 → 사는데.", verweis: "g-vornomen", bsp: [
      ["지금 마트에 [가는데] 뭐 필요해요?", "Ich gehe jetzt in den Supermarkt – brauchst du etwas?", "Verb → 는데"],
      ["날씨가 [좋은데] 산책할까요?", "Das Wetter ist schön – gehen wir spazieren?", "Eigenschaftswort, 좋 hat unten ㅎ → 은데"],
      ["[바쁜데] 도와줘서 고마워요.", "Danke, dass du hilfst, obwohl du viel zu tun hast.", "바쁘 endet auf Vokal → ㄴ kommt unten an die Silbe"],
      ["전화를 [했는데] 안 받았어요.", "Ich habe angerufen, aber niemand hat abgehoben.", "Vergangenheit → 했는데"],
      ["제 [친구인데] 한국말을 잘해요.", "Das ist mein Freund, er spricht gut Koreanisch.", "Nomen → 인데"],
      ["시간이 [없는데] 어떻게 하죠?", "Wir haben keine Zeit – was machen wir?", "없다 → 는데"]
    ] },
    "a2-02n3": { mehr: "-고 hängt direkt am Stamm. Es verbindet zwei Eigenschaften („und“) oder zwei Handlungen nacheinander („und dann“). Die Zeit steht meist nur am Satzende. Die beiden Teile dürfen verschiedene Personen haben. Wenn der zweite Schritt auf dem ersten aufbaut, nimmt man statt -고 lieber -아서 (가서 먹어요).", bsp: [
      ["이 방은 [넓고] 밝아요.", "Dieses Zimmer ist groß und hell."],
      ["숙제를 [하고] 놀아요.", "Ich mache die Hausaufgabe und spiele dann."],
      ["저는 커피를 [마시고] 아내는 차를 마셔요.", "Ich trinke Kaffee und meine Frau Tee.", "zwei verschiedene Personen"],
      ["손을 [씻고] 먹어.", "Wasch dir die Hände und iss dann.", "vertraute Form"],
      ["어제 영화를 [보고] 저녁을 먹었어요.", "Gestern habe ich einen Film gesehen und dann zu Abend gegessen.", "Vergangenheit nur am Ende"],
      ["[싸고] 좋은 거 있어요?", "Gibt es etwas Günstiges und Gutes?"]
    ] },
    "a2-02n4": { mehr: "Gebildet wie mitten im Satz, dazu 요. Man nennt nur den Hintergrund und lässt den Rest offen; der andere soll darauf reagieren. Das klingt weicher als eine fertige Aussage. Typisch am Telefon, bei einer höflichen Absage, bei sanftem Widerspruch und bei leichter Überraschung.", bsp: [
      ["지금 안 [계시는데요].", "Er ist gerade nicht da …", "am Telefon"],
      ["저는 잘 [모르겠는데요].", "Das weiß ich leider nicht so genau …"],
      ["이거 제 [건데요].", "Das gehört aber mir …", "거 + 인데요 → 건데요"],
      ["아직 안 [왔는데요].", "Er ist noch nicht gekommen …"],
      ["오늘은 좀 [어려운데요].", "Heute ist es eher schwierig …", "höfliche Absage"],
      ["맛이 [괜찮은데요]!", "Das schmeckt ja gar nicht schlecht!", "leichte Überraschung"]
    ] },

    // ---------- a2-03 Wenn und als ----------
    "a2-03n1": { kv: "stamm", mehr: "Bildung: Stamm + 면, nach Konsonant 으면. Stämme auf ㄹ bekommen kein 으 (살면, 만들면). Unregelmäßig: 춥다 → 추우면, 듣다 → 들으면. -(으)면 heißt „falls“ und „immer wenn“. Für ein einmaliges Ereignis in der Vergangenheit („als ich ankam“) passt es nicht; dafür nimmt man -(으)ㄹ 때. 만약 am Satzanfang verstärkt das „falls“.", verweis: "g-anschluss", bsp: [
      ["[추우면] 말하세요.", "Sagen Sie es, wenn Ihnen kalt ist.", "춥다 → 추우면"],
      ["돈이 [있으면] 여행 가고 싶어요.", "Wenn ich Geld hätte, würde ich gern verreisen.", "있 → 으면"],
      ["많이 [먹으면] 배가 아파요.", "Wenn man viel isst, bekommt man Bauchweh.", "immer wenn"],
      ["서울에 [오면] 연락하세요.", "Melden Sie sich, wenn Sie nach Seoul kommen.", "오 endet auf Vokal → 면"],
      ["[괜찮으면] 같이 저녁 먹어요.", "Wenn es dir passt, essen wir zusammen zu Abend."],
      ["김치를 [만들면] 좀 주세요.", "Wenn Sie Kimchi machen, geben Sie mir bitte etwas.", "만들다: Stamm auf ㄹ, kein 으"]
    ] },
    "a2-03n2": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 때; das ㄹ kommt unten an die Silbe (가 → 갈 때). Nach Konsonant 을 때 (먹을 때). Stämme auf ㄹ bleiben, wie sie sind (살 때, 만들 때). Ist das Ereignis abgeschlossen, sagt man -았을 때 / -었을 때 (만났을 때). Hinter einem Nomen steht nur 때: 점심 때, 방학 때, 그때 (damals). 때 kann Partikeln tragen: 때는, 때도, 때마다 (jedes Mal, wenn).", verweis: "g-vornomen", bsp: [
      ["한국에 [살 때] 자주 갔어요.", "Als ich in Korea gewohnt habe, bin ich oft hingegangen.", "Stamm auf ㄹ bleibt"],
      ["[운전할 때] 전화하지 마세요.", "Telefonieren Sie nicht beim Fahren."],
      ["처음 [만났을 때] 기억나요?", "Erinnerst du dich, wie wir uns zum ersten Mal getroffen haben?", "abgeschlossen → 만났을 때"],
      ["[아플 때] 이 약을 드세요.", "Nehmen Sie dieses Medikament, wenn Sie Schmerzen haben."],
      ["[어릴 때] 여기 살았어요.", "Als Kind habe ich hier gewohnt."],
      ["[저녁 때] 다시 올게요.", "Am Abend komme ich wieder.", "Nomen + 때"]
    ] },
    "a2-03n3": { mehr: "Wörtlich: „Wenn …, wäre es gut.“ Damit wünscht man sich etwas, das man nicht selbst in der Hand hat. Häufig steht davor die Vergangenheit (-았으면 좋겠어요); die Bedeutung bleibt gleich, der Wunsch klingt etwas stärker. Was man selbst tun möchte, sagt man mit -고 싶어요.", bsp: [
      ["주말에 비가 안 [오면 좋겠어요].", "Hoffentlich regnet es am Wochenende nicht."],
      ["시간이 더 [있으면 좋겠어요].", "Ich hätte gern mehr Zeit."],
      ["아이가 잘 [먹으면 좋겠어요].", "Ich wünschte, das Kind würde gut essen."],
      ["빨리 [나았으면 좋겠어요].", "Hoffentlich wirst du bald gesund.", "mit Vergangenheit: derselbe Wunsch, etwas stärker"],
      ["같이 [가면 좋겠어요].", "Es wäre schön, wenn wir zusammen gehen könnten."]
    ] },
    "a2-03n4": { mehr: "Wörtlich: „Wenn …, geht es.“ Damit sagt man, was genügt oder wie etwas geht. Als Frage bedeutet es „Reicht es, wenn …?“ oder „Was soll ich tun?“ – die übliche Art, nach dem Weg oder dem Ablauf zu fragen. Das Gegenstück -(으)면 안 돼요 heißt „man darf nicht“.", bsp: [
      ["몇 시까지 [가면 돼요]?", "Bis wann soll ich dort sein?"],
      ["이 버튼을 [누르면 돼요].", "Sie müssen nur diesen Knopf drücken."],
      ["여기에 이름을 [쓰면 돼요].", "Hier schreiben Sie Ihren Namen hin."],
      ["내일까지 [하면 돼요].", "Es reicht, wenn Sie es bis morgen machen."],
      ["하나만 [사면 돼요].", "Eines zu kaufen reicht."],
      ["어디에서 [갈아타면 돼요]?", "Wo muss ich umsteigen?"]
    ] },

    // ---------- a2-04 Vorher, nachher, währenddessen ----------
    "a2-04n1": { mehr: "기 macht aus dem Verb ein Nomen („das Schlafen“), 전에 heißt „davor“. 기 hängt direkt am Stamm, egal ob Konsonant oder Vokal. Vor 기 steht nie eine Vergangenheit, auch wenn alles schon vorbei ist. Hinter einem Nomen oder einer Zeitangabe steht nur 전에: 식사 전에, 한 시간 전에 (vor einer Stunde), 조금 전에 (vorhin).", bsp: [
      ["[가기 전에] 전화할게요.", "Ich rufe an, bevor ich komme."],
      ["[잊기 전에] 메모하세요.", "Schreiben Sie es auf, bevor Sie es vergessen."],
      ["[사기 전에] 한번 입어 보세요.", "Probieren Sie es an, bevor Sie es kaufen."],
      ["한국에 [오기 전에] 뭐 했어요?", "Was haben Sie gemacht, bevor Sie nach Korea gekommen sind?", "auch bei Vergangenem bleibt es 오기"],
      ["[조금 전에] 먹었어요.", "Ich habe vorhin gegessen.", "Zeitangabe + 전에"],
      ["[수업 전에] 커피를 마셔요.", "Vor dem Unterricht trinke ich Kaffee.", "Nomen + 전에"]
    ] },
    "a2-04n2": { kv: "stamm", mehr: "Bildung: Stamm + ㄴ 후에; das ㄴ kommt unten an die Silbe (가 → 간 후에). Nach Konsonant 은 후에 (먹은 후에). Bei Stämmen auf ㄹ fällt das ㄹ weg (만들다 → 만든 후에). 듣다 → 들은 후에. Gleichbedeutend und im Gespräch häufiger: -(으)ㄴ 다음에. Hinter einem Nomen oder einer Zeitangabe steht nur 후에: 퇴근 후에, 한 시간 후에 (in einer Stunde).", verweis: "g-vornomen", bsp: [
      ["밥을 [먹은 후에] 약을 드세요.", "Nehmen Sie das Medikament nach dem Essen.", "먹 hat unten ㄱ → 은"],
      ["아이가 [잔 후에] 영화를 봐요.", "Wenn das Kind schläft, schauen wir einen Film.", "자 + ㄴ → 잔"],
      ["일이 [끝난 다음에] 만나요.", "Treffen wir uns nach der Arbeit.", "다음에 statt 후에"],
      ["[결혼한 후에] 이사했어요.", "Nach der Hochzeit sind wir umgezogen."],
      ["[수업 후에] 뭐 해요?", "Was machst du nach dem Unterricht?", "Nomen + 후에"],
      ["[삼십 분 후에] 다시 전화할게요.", "Ich rufe in dreißig Minuten noch einmal an.", "Zeitangabe + 후에"]
    ] },
    "a2-04n3": { mehr: "Stamm + 고 나서, nur bei Verben. Es bedeutet dasselbe wie -고, betont aber: Erst ist das eine ganz fertig, dann kommt das Nächste. Oft steht 다 (ganz, fertig) davor.", bsp: [
      ["밥 [먹고 나서] 산책해요.", "Nach dem Essen gehen wir spazieren."],
      ["이 책을 다 [읽고 나서] 빌려줄게요.", "Wenn ich das Buch fertig gelesen habe, leihe ich es dir."],
      ["[생각해 보고 나서] 연락할게요.", "Ich überlege es mir und melde mich dann."],
      ["일을 [끝내고 나서] 갈게요.", "Ich mache die Arbeit fertig und komme dann."],
      ["손을 [씻고 나서] 먹어.", "Erst Hände waschen, dann essen.", "vertraute Form"]
    ] },
    "a2-04n4": { kv: "stamm", mehr: "Bildung: Stamm + 면서, nach Konsonant 으면서. Stämme auf ㄹ bekommen kein 으 (놀면서). 듣다 → 들으면서, 걷다 → 걸으면서. Es geht nur, wenn dieselbe Person beides gleichzeitig tut. Die Hauptsache steht hinten, das Nebenbei vorn.", verweis: "g-anschluss", bsp: [
      ["커피를 [마시면서] 얘기해요.", "Reden wir bei einem Kaffee."],
      ["[운전하면서] 전화하면 안 돼요.", "Beim Fahren darf man nicht telefonieren."],
      ["노래를 [들으면서] 걸어요.", "Ich gehe und höre dabei Musik.", "듣다 → 들으면서"],
      ["[웃으면서] 인사했어요.", "Sie hat lächelnd gegrüßt.", "웃 hat unten ㅅ → 으면서"],
      ["[일하면서] 공부해요.", "Ich arbeite und lerne nebenbei."],
      ["아이는 [놀면서] 배워요.", "Ein Kind lernt beim Spielen.", "놀다: Stamm auf ㄹ, kein 으"]
    ] },

    // ---------- a2-05 Vorhaben und Entschlüsse ----------
    "a2-05n1": { kv: "stamm", mehr: "Bildung: Stamm + 려고, nach Konsonant 으려고. Stämme auf ㄹ bekommen kein 으 (만들려고). Mitten im Satz heißt es „um zu“. Am Satzende mit 해요 heißt es „ich habe vor“. -(으)려고 했어요 bedeutet „ich wollte eigentlich“ – meist ist es dann nicht dazu gekommen. Nach -(으)려고 folgt keine Bitte und kein Vorschlag.", verweis: "g-anschluss", bsp: [
      ["한국어를 [배우려고] 앱을 써요.", "Um Koreanisch zu lernen, benutze ich eine App."],
      ["일찍 [일어나려고] 일찍 자요.", "Um früh aufzustehen, gehe ich früh schlafen."],
      ["[전화하려고] 했는데 깜빡했어요.", "Ich wollte anrufen, habe es aber verschwitzt.", "려고 했는데 = wollte eigentlich"],
      ["주말에 뭐 [하려고] 해요?", "Was hast du am Wochenende vor?"],
      ["저녁을 [만들려고] 장을 봤어요.", "Ich habe eingekauft, um das Abendessen zu kochen.", "만들다: Stamm auf ㄹ, kein 으"],
      ["사진을 [찍으려고] 일찍 왔어요.", "Ich bin früh gekommen, um Fotos zu machen.", "찍 hat unten ㄱ → 으려고"]
    ] },
    "a2-05n2": { kv: "stamm", mehr: "Bildung: Stamm + 러, nach Konsonant 으러. Stämme auf ㄹ bekommen kein 으 (놀러 가요). -(으)러 steht nur vor Verben der Bewegung: 가다, 오다, 다니다, 나가다. Bei allen anderen Verben nimmt man -(으)려고. Nach -(으)러 sind Bitte und Vorschlag erlaubt.", bsp: [
      ["주말에 [놀러] 오세요.", "Kommen Sie am Wochenende auf Besuch.", "놀다: Stamm auf ㄹ, kein 으"],
      ["돈을 [찾으러] 은행에 가요.", "Ich gehe zur Bank, um Geld abzuheben.", "찾 hat unten ㅈ → 으러"],
      ["한국어를 [배우러] 한국에 왔어요.", "Ich bin nach Korea gekommen, um Koreanisch zu lernen."],
      ["같이 밥 [먹으러] 갈까요?", "Gehen wir zusammen essen?"],
      ["아이를 [데리러] 유치원에 가요.", "Ich gehe in den Kindergarten, um das Kind abzuholen."],
      ["뭐 [사러] 왔어요?", "Was möchten Sie kaufen?", "wörtlich: Was zu kaufen sind Sie gekommen?"]
    ] },
    "a2-05n3": { mehr: "Stamm + 기로 했어요. Es steht für einen eigenen Entschluss und genauso für eine Abmachung mit anderen. Verneint: 안 -기로 했어요 (beschlossen, etwas nicht zu tun). In der Gegenwart, -기로 해요, schlägt man eine Abmachung vor: „Machen wir es so.“", bsp: [
      ["내년에 [이사하기로 했어요].", "Wir haben beschlossen, nächstes Jahr umzuziehen."],
      ["담배를 [끊기로 했어요].", "Ich habe beschlossen, mit dem Rauchen aufzuhören."],
      ["친구하고 일곱 시에 [만나기로 했어요].", "Ich habe mit einem Freund ausgemacht, dass wir uns um sieben treffen."],
      ["오늘은 안 [마시기로 했어요].", "Ich habe beschlossen, heute nichts zu trinken."],
      ["그럼 그렇게 [하기로 해요].", "Dann machen wir es so.", "기로 해요 = Vorschlag für eine Abmachung"]
    ] },
    "a2-05n4": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ래요, nach Konsonant 을래요. Stämme auf ㄹ: 만들래요, 놀래요. Als Aussage sagt es, was ich jetzt will. Als Frage lädt es den anderen freundlich ein. Gegenüber Älteren und Fremden fragt man höflicher mit -(으)ㄹ까요? oder -(으)시겠어요?. Zum Vergleich: -(으)ㄹ게요 ist eine Zusage mit Rücksicht auf den anderen, -(으)ㄹ래요 der eigene Wille.", bsp: [
      ["저는 집에 [있을래요].", "Ich bleibe lieber zu Hause.", "있 → 을래요"],
      ["뭐 [마실래요]?", "Was möchtest du trinken?"],
      ["여기 [앉을래요]?", "Möchtest du dich hierher setzen?"],
      ["같이 영화 [볼래요]?", "Wollen wir zusammen einen Film schauen?"],
      ["저는 안 [갈래요].", "Ich möchte nicht mitgehen."],
      ["뭐 [먹을래]?", "Was willst du essen?", "vertraute Form"]
    ] },

    // ---------- a2-06 Erfahrung und Können ----------
    "a2-06n1": { kv: "stamm", mehr: "Bildung: Stamm + ㄴ 적이 있어요, nach Konsonant 은 적이 있어요. Bei Stämmen auf ㄹ fällt das ㄹ weg (만든 적, 산 적). 듣다 → 들은 적. Sehr oft steht -아/어 보다 davor: 가 본 적이 있어요 (schon einmal dort gewesen). Man verwendet es für Besonderes, nicht für Alltägliches. Im Gespräch fällt 이 oft weg. Mit 한 번도 und 없어요: noch kein einziges Mal.", verweis: "g-vornomen", bsp: [
      ["한국 드라마를 [본 적이 있어요].", "Ich habe schon einmal eine koreanische Serie gesehen."],
      ["김치를 [만든 적이 있어요]?", "Haben Sie schon einmal Kimchi gemacht?", "만들다: ㄹ fällt weg → 만든"],
      ["그 이야기를 [들은 적이 있어요].", "Die Geschichte habe ich schon einmal gehört.", "듣다 → 들은"],
      ["비행기를 [놓친 적이 있어요].", "Ich habe schon einmal ein Flugzeug verpasst."],
      ["한 번도 [늦은 적이 없어요].", "Ich bin noch kein einziges Mal zu spät gekommen.", "늦 hat unten ㅈ → 은"],
      ["외국에서 [산 적이 있어요]?", "Haben Sie schon einmal im Ausland gelebt?", "살다: ㄹ fällt weg → 산"]
    ] },
    "a2-06n2": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 봤어요. In der Gegenwart heißt -아/어 보다 „ausprobieren“ (먹어 보세요), in der Vergangenheit „schon einmal gemacht haben“. Mit 보다 (sehen) selbst geht es nicht: 봤어요, nicht 봐 봤어요. Antworten: 네, 먹어 봤어요. · 아니요, 안 먹어 봤어요. · 아직 못 먹어 봤어요.", bsp: [
      ["한국 술 [마셔 봤어요]?", "Haben Sie schon koreanischen Alkohol probiert?"],
      ["이 앱 [써 봤어요]?", "Hast du diese App schon ausprobiert?"],
      ["아직 못 [가 봤어요].", "Da war ich noch nicht."],
      ["한번 [해 봤어요]. 어려웠어요.", "Ich habe es einmal versucht. Es war schwer."],
      ["매운 음식도 [먹어 봤어요].", "Ich habe auch schon scharfes Essen probiert."],
      ["서울에서 지하철 [타 봤어요]?", "Sind Sie in Seoul schon U-Bahn gefahren?"]
    ] },
    "a2-06n3": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 줄 알아요, nach Konsonant 을 줄 알아요. Stämme auf ㄹ bleiben (만들 줄 알아요). Es steht für etwas Erlerntes: fahren, schwimmen, kochen, ein Instrument, eine Schrift. Zum Vergleich: -(으)ㄹ 수 있어요 heißt auch „es ist möglich, die Umstände erlauben es“. 운전할 줄 알아요 = ich habe es gelernt. 오늘은 운전할 수 없어요 = heute geht es nicht.", bsp: [
      ["한글을 [읽을 줄 알아요].", "Ich kann Hangul lesen.", "읽 → 을 줄"],
      ["자전거 [탈 줄 알아요]?", "Kannst du Rad fahren?"],
      ["김치찌개를 [만들 줄 알아요].", "Ich kann Kimchi-Eintopf kochen.", "Stamm auf ㄹ bleibt"],
      ["젓가락을 [쓸 줄 몰라요].", "Ich kann nicht mit Stäbchen essen."],
      ["기타를 [칠 줄 알아요]?", "Kannst du Gitarre spielen?"],
      ["운전할 줄 [알지만] 차가 없어요.", "Ich kann fahren, habe aber kein Auto."]
    ] },
    "a2-06n4": { mehr: "처음 = zum ersten Mal; 처음이에요 = „das ist das erste Mal“; 처음에는 = am Anfang. 다시 = noch einmal von vorn, etwa beim Wiederholen oder Verbessern. 또 = wieder, zusätzlich; es kann auch genervt klingen (또요? = schon wieder?). 또 만나요 und 또 봐요 sagt man zum Abschied. 다시는 mit Verneinung = nie wieder.", bsp: [
      ["한국은 [처음]이에요.", "Ich bin zum ersten Mal in Korea."],
      ["[처음에는] 어려웠어요.", "Am Anfang war es schwer."],
      ["[다시] 한번 말해 주세요.", "Sagen Sie es bitte noch einmal."],
      ["[또] 만나요.", "Bis zum nächsten Mal.", "wörtlich: treffen wir uns wieder"],
      ["[또] 비가 와요.", "Es regnet schon wieder."],
      ["[다시는] 안 할게요.", "Das mache ich nie wieder."]
    ] },

    // ---------- a2-07 Erlaubt, verboten, nicht nötig ----------
    "a2-07n1": { kv: "stamm", mehr: "Gebaut aus -(으)면 (wenn) und 안 돼요 (es geht nicht). Als Frage ist es eine vorsichtige Bitte: 여기 앉으면 안 돼요? = „Dürfte ich mich hierher setzen?“ Zum Kind sagt man kurz 안 돼! Das Gegenstück ist -아도/어도 돼요 (man darf). -지 마세요 ist dagegen eine direkte Aufforderung an eine bestimmte Person.", bsp: [
      ["여기에서 [수영하면 안 돼요].", "Hier darf man nicht schwimmen."],
      ["이 약은 술하고 같이 [먹으면 안 돼요].", "Dieses Medikament darf man nicht mit Alkohol nehmen.", "먹 → 으면"],
      ["수업에 [늦으면 안 돼요].", "Zum Unterricht darf man nicht zu spät kommen."],
      ["혼자 [가면 안 돼].", "Du darfst nicht allein gehen.", "vertraute Form, zum Kind"],
      ["조금 더 [있으면 안 돼요]?", "Können wir nicht noch ein bisschen bleiben?", "als Frage: eine Bitte"],
      ["아무한테도 [말하면 안 돼요].", "Das dürfen Sie niemandem sagen."]
    ] },
    "a2-07n2": { mehr: "-아도/어도 돼요 heißt „man darf“. Verneint man das Verb davor, wird daraus „man muss nicht“. Kurz: 안 + Verb + 아도 돼요. Lang: Stamm + 지 않아도 돼요. Bei Verben mit 하다 steht 안 direkt vor 하다 (걱정 안 해도 돼요). Achtung: „nicht müssen“ (안 해도 돼요) und „nicht dürfen“ (하면 안 돼요) sind zwei verschiedene Formen.", bsp: [
      ["오늘은 요리 [안 해도 돼요].", "Heute musst du nicht kochen."],
      ["다 [먹지 않아도 돼요].", "Sie müssen nicht alles aufessen."],
      ["신발을 [안 벗어도 돼요].", "Man muss die Schuhe nicht ausziehen."],
      ["[서두르지 않아도 돼요].", "Sie müssen sich nicht beeilen."],
      ["[안 사도 돼요]. 집에 있어요.", "Du musst es nicht kaufen. Wir haben es zu Hause."],
      ["내일은 [안 가도 돼요]?", "Muss ich morgen nicht hin?"]
    ] },
    "a2-07n3": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 도 (가요 → 가도, 먹어요 → 먹어도, 해요 → 해도, 바빠요 → 바빠도, 추워요 → 추워도). Bedeutung: auch wenn, selbst wenn, obwohl. Mit 아무리 davor: egal wie sehr. Mit einem Fragewort: 어디에 가도 (wohin auch immer), 뭘 먹어도 (was auch immer), 언제 와도 (wann auch immer).", verweis: "g-anschluss", bsp: [
      ["[추워도] 매일 산책해요.", "Auch wenn es kalt ist, gehe ich jeden Tag spazieren.", "추워요 → 추워도"],
      ["[비싸도] 살 거예요.", "Ich kaufe es, auch wenn es teuer ist."],
      ["아무리 [먹어도] 배가 안 불러요.", "Egal wie viel ich esse, ich werde nicht satt."],
      ["[들어도] 잘 모르겠어요.", "Auch wenn ich es höre, verstehe ich es nicht recht.", "듣다 → 들어도"],
      ["어디에 [가도] 사람이 많아요.", "Wohin man auch geht, es sind viele Leute."],
      ["[힘들어도] 포기하지 마세요.", "Geben Sie nicht auf, auch wenn es schwer ist."]
    ] },
    "a2-07n4": { mehr: "Stamm + 지 않아요, Vergangenheit -지 않았어요. Die Bedeutung ist dieselbe wie bei 안. Die lange Form ist bei längeren Wörtern bequemer und in geschriebenen Texten üblich. Als Frage, -지 않아요?, erwartet sie Zustimmung: „Ist es nicht …?“ Die lange Form von 못 heißt -지 못해요.", bsp: [
      ["오늘은 [춥지 않아요].", "Heute ist es nicht kalt."],
      ["고기를 [먹지 않아요].", "Ich esse kein Fleisch."],
      ["별로 [어렵지 않았어요].", "Es war nicht besonders schwer.", "Vergangenheit: 않았어요"],
      ["그렇게 [비싸지 않아요].", "Es ist nicht so teuer."],
      ["좀 [덥지 않아요]?", "Ist es nicht ein bisschen heiß?", "als Frage: man erwartet Zustimmung"],
      ["아직 [끝나지 않았어요].", "Es ist noch nicht zu Ende."]
    ] },

    // ---------- a2-08 Näher beschreiben ----------
    "a2-08n1": { mehr: "Stamm + 는, egal ob Konsonant oder Vokal. Bei Stämmen auf ㄹ fällt das ㄹ weg (살다 → 사는, 만들다 → 만드는, 알다 → 아는). 있다 und 없다 bekommen ebenfalls 는 (맛있는, 재미없는). In der Beschreibung steht die handelnde Person mit 이/가 (제가, 아내가), nicht mit 은/는. Das Deutsche stellt die Beschreibung hinter das Nomen, das Koreanische davor.", verweis: "g-vornomen", bsp: [
      ["제가 [다니는] 회사예요.", "Das ist die Firma, in der ich arbeite."],
      ["지금 [사는] 집이 좋아요.", "Die Wohnung, in der ich jetzt wohne, gefällt mir.", "살다: ㄹ fällt weg → 사는"],
      ["한국어를 [배우는] 사람이 많아요.", "Es gibt viele Leute, die Koreanisch lernen."],
      ["[맛있는] 거 먹고 싶어요.", "Ich möchte etwas Gutes essen.", "있다 → 있는"],
      ["[아는] 사람이에요?", "Kennst du die Person?", "알다 → 아는"],
      ["아내가 [좋아하는] 노래예요.", "Das ist ein Lied, das meine Frau mag.", "Person in der Beschreibung mit 가"]
    ] },
    "a2-08n2": { kv: "stamm", mehr: "Bildung: Stamm + ㄴ; das ㄴ kommt unten an die Silbe (가 → 간, 보 → 본, 하 → 한). Nach Konsonant 은 (먹은, 읽은). Bei Stämmen auf ㄹ fällt das ㄹ weg (만든, 산). 듣다 → 들은. Achtung: Beim Eigenschaftswort bedeutet dieselbe Endung Gegenwart (작은 집 = ein kleines Haus), beim Verb Vergangenheit (먹은 음식 = das Essen, das ich gegessen habe).", verweis: "g-vornomen", bsp: [
      ["어제 [먹은] 음식이 맛있었어요.", "Das Essen von gestern war gut.", "먹 → 은"],
      ["제가 [찍은] 사진이에요.", "Das ist ein Foto, das ich gemacht habe."],
      ["지난번에 [간] 식당에 또 가요.", "Gehen wir wieder in das Lokal vom letzten Mal.", "가 + ㄴ → 간"],
      ["친구한테서 [받은] 선물이에요.", "Das ist ein Geschenk, das ich von einem Freund bekommen habe."],
      ["아내가 [만든] 김치예요.", "Das ist Kimchi, das meine Frau gemacht hat.", "만들다: ㄹ fällt weg → 만든"],
      ["처음 [들은] 이야기예요.", "Das höre ich zum ersten Mal.", "듣다 → 들은"]
    ] },
    "a2-08n3": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ; das ㄹ kommt unten an die Silbe (가 → 갈, 하 → 할). Nach Konsonant 을 (먹을, 읽을). Stämme auf ㄹ bleiben (만들, 살). Die Form steht für das, was noch kommt oder möglich ist. Häufige feste Verbindungen: 할 일 (zu tun), 먹을 것 (etwas zu essen), 갈 곳 (ein Ziel), -(으)ㄹ 시간이 없어요 (keine Zeit zu …).", verweis: "g-vornomen", bsp: [
      ["오늘 [할] 일이 많아요.", "Heute gibt es viel zu tun."],
      ["[읽을] 책을 가져왔어요.", "Ich habe ein Buch zum Lesen mitgebracht.", "읽 → 을"],
      ["[쉴] 시간이 없어요.", "Ich habe keine Zeit zum Ausruhen."],
      ["내일 [입을] 옷을 준비해요.", "Ich lege die Kleidung für morgen bereit."],
      ["[물어볼] 게 있어요.", "Ich habe eine Frage.", "wörtlich: Es gibt etwas zu fragen."],
      ["서울에는 [볼] 게 많아요.", "In Seoul gibt es viel zu sehen."]
    ] },
    "a2-08n4": { mehr: "것 ist ein Platzhalter-Nomen: „Ding, das …“. Gesprochen heißt es 거 und verschmilzt mit den Partikeln: 것이 → 게, 것은 → 건, 것을 → 걸, 것이에요 → 거예요. Mit 것 wird aus jeder Beschreibung ein Nomen: 요리하는 것 = das Kochen. Für Besitz: 제 거 (meins), 누구 거예요? (Wem gehört das?). 데 heißt im Gespräch „Ort, Stelle“; 곳 ist das neutrale Wort dafür.", bsp: [
      ["이건 누구 [거]예요?", "Wem gehört das?"],
      ["단 [거] 먹고 싶어요.", "Ich möchte etwas Süßes essen."],
      ["제가 말한 [게] 이거예요.", "Das hier habe ich gemeint.", "것이 → 게"],
      ["요리하는 [걸] 좋아해요.", "Ich koche gern.", "것을 → 걸"],
      ["주차할 [데]가 없어요.", "Es gibt keinen Parkplatz.", "ein Ort zum Parken"],
      ["아픈 [데] 없어요?", "Tut Ihnen etwas weh?", "wörtlich: Gibt es keine Stelle, die wehtut?"]
    ] },

    // ---------- a2-09 Vermuten und Eindruck ----------
    "a2-09n1": { kv: "stamm", mehr: "Aufbau: Beschreibungsform + 것 같아요. Verb, jetzt: 는 것 같아요. Verb, vorbei: (으)ㄴ 것 같아요. Eigenschaftswort: (으)ㄴ 것 같아요. Für das, was noch kommt: (으)ㄹ 것 같아요. Nomen: 인 것 같아요. Im Koreanischen macht man damit auch die eigene Meinung weicher: 좋은 것 같아요 heißt oft einfach „ich finde es gut“. Gesprochen: 거 같아요.", verweis: "g-vornomen", bsp: [
      ["아이가 [자는 것 같아요].", "Das Kind schläft anscheinend.", "Verb, jetzt → 는"],
      ["벌써 [간 것 같아요].", "Er ist anscheinend schon gegangen.", "Verb, vorbei → ㄴ"],
      ["이 옷은 좀 [작은 것 같아요].", "Ich glaube, das ist etwas zu klein.", "Eigenschaftswort → 은"],
      ["내일 비가 [올 것 같아요].", "Morgen wird es wohl regnen.", "kommt noch → ㄹ"],
      ["저 사람은 [학생인 것 같아요].", "Die Person dort ist wohl Student.", "Nomen → 인"],
      ["저는 [괜찮은 거 같아요].", "Ich finde es in Ordnung.", "gesprochen 거 statt 것"]
    ] },
    "a2-09n2": { mehr: "Nur bei Eigenschaftswörtern. Bildung: höfliche Gegenwart ohne 요, dann 보여요 (좋아요 → 좋아 보여요, 피곤해요 → 피곤해 보여요, 어려워요 → 어려워 보여요). Vergangenheit: 보였어요. Unterschied: -아/어 보여요 stützt sich nur auf das, was man sieht. 것 같아요 ist ein Schluss aus allem, was man weiß.", bsp: [
      ["이 가방은 [비싸 보여요].", "Diese Tasche sieht teuer aus."],
      ["[어려워 보여요].", "Das sieht schwierig aus.", "어려워요 → 어려워 보여요"],
      ["오늘 [행복해 보여요].", "Du siehst heute glücklich aus."],
      ["사진보다 [젊어 보여요].", "Sie sehen jünger aus als auf dem Foto."],
      ["어제는 좀 [아파 보였어요].", "Gestern hast du etwas krank ausgesehen.", "Vergangenheit: 보였어요"],
      ["[편해 보여요].", "Das sieht bequem aus."]
    ] },
    "a2-09n3": { mehr: "Stamm + 겠어요. Man schließt aus der Lage des anderen, wie es ihm gehen muss – so zeigt man Anteilnahme. Für Vergangenes: -았겠어요 / -었겠어요. Vertraut oder zu sich selbst: -겠다 (맛있겠다!). In festen Formeln steckt dasselbe 겠, ohne dass man es als Vermutung hört: 알겠어요, 모르겠어요, 잘 먹겠습니다.", bsp: [
      ["[피곤하겠어요]. 좀 쉬세요.", "Sie sind sicher müde. Ruhen Sie sich etwas aus."],
      ["[좋겠어요]!", "Wie schön für Sie!", "wörtlich: Das muss gut sein."],
      ["많이 [놀랐겠어요].", "Da sind Sie sicher sehr erschrocken.", "Vergangenes: 놀랐 + 겠어요"],
      ["와, [재미있겠다]!", "Oh, das wird sicher lustig!", "vertraut, zu sich selbst"],
      ["아이가 [좋아하겠어요].", "Das Kind wird sich sicher freuen."],
      ["[춥겠어요]. 들어오세요.", "Ihnen ist sicher kalt. Kommen Sie herein."]
    ] },
    "a2-09n4": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ지도 몰라요, nach Konsonant 을지도 몰라요. Für Vergangenes: -았을지도 몰라요 (könnte gewesen sein). Wörtlich: „Ob vielleicht …, weiß ich nicht.“ Es ist schwächer als 것 같아요: Man hält etwas nur für möglich. Oft steht 어쩌면 am Satzanfang.", bsp: [
      ["어쩌면 못 [갈지도 몰라요].", "Vielleicht kann ich nicht kommen."],
      ["자리가 [없을지도 몰라요].", "Vielleicht ist kein Platz frei.", "없 → 을지도"],
      ["벌써 [도착했을지도 몰라요].", "Vielleicht ist er schon angekommen.", "Vergangenes: 했을지도"],
      ["좀 [매울지도 몰라요].", "Es könnte etwas scharf sein.", "맵다 → 매울"],
      ["아이가 [싫어할지도 몰라요].", "Vielleicht mag das Kind es nicht."]
    ] },

    // ---------- a2-10 Vergleichen und sich verändern ----------
    "a2-10n1": { mehr: "보다 hängt direkt an dem, womit man vergleicht – am „als“-Teil. A가 B보다 커요 = A ist größer als B. Die Reihenfolge ist frei: B보다 A가 커요 bedeutet dasselbe. 더 (mehr) kann dazukommen, muss aber nicht. 덜 = weniger, 훨씬 = viel. 보다 steht auch hinter Zeitwörtern: 어제보다, 전보다, 생각보다.", bsp: [
      ["오늘이 어제[보다] 더워요.", "Heute ist es heißer als gestern."],
      ["저[보다] 아내가 요리를 잘해요.", "Meine Frau kocht besser als ich.", "die Reihenfolge ist frei"],
      ["버스[보다] 지하철이 편해요.", "Die U-Bahn ist bequemer als der Bus."],
      ["전[보다] 많이 좋아졌어요.", "Es ist viel besser geworden als früher."],
      ["이게 그것[보다] 덜 매워요.", "Das hier ist weniger scharf als das da.", "덜 = weniger"],
      ["말하기가 듣기[보다] 어려워요.", "Sprechen ist schwerer als Hören."]
    ] },
    "a2-10n2": { mehr: "제일 und 가장 stehen direkt vor dem Wort, das sie steigern. Die Gruppe, in der verglichen wird, nennt man mit 중에서 (unter, von) oder 에서 (in): 과일 중에서, 한국에서, 세상에서. 제일 heißt wörtlich „Nummer eins“ und ist die gesprochene Form.", bsp: [
      ["과일 중에서 딸기를 [제일] 좋아해요.", "Von allem Obst mag ich Erdbeeren am liebsten.", "중에서 = unter, von"],
      ["우리 가족 중에서 제가 [제일] 키가 커요.", "In unserer Familie bin ich der Größte."],
      ["한국에서 [가장] 높은 산이에요.", "Das ist der höchste Berg Koreas."],
      ["요즘이 [제일] 바빠요.", "Zurzeit habe ich am meisten zu tun."],
      ["[제일] 싼 걸로 주세요.", "Geben Sie mir das Billigste."],
      ["뭐가 [제일] 힘들어요?", "Was ist am anstrengendsten?"]
    ] },
    "a2-10n3": { mehr: "Nur bei Eigenschaftswörtern. Bildung: höfliche Gegenwart ohne 요, dann 져요 (좋아요 → 좋아져요, 커요 → 커져요, 추워요 → 추워져요, 달라요 → 달라져요). Meist steht es in der Vergangenheit (-아졌어요 = ist … geworden) oder im Verlauf (-아지고 있어요 = wird gerade …).", verweis: "g-anschluss", bsp: [
      ["요즘 해가 [짧아졌어요].", "Die Tage sind kürzer geworden."],
      ["아이가 많이 [커졌어요].", "Das Kind ist sehr gewachsen.", "커요 → 커졌어요"],
      ["운동하면 기분이 [좋아져요].", "Wenn man Sport macht, bessert sich die Laune."],
      ["집값이 많이 [비싸졌어요].", "Wohnungen sind viel teurer geworden."],
      ["날씨가 [따뜻해지고 있어요].", "Es wird gerade wärmer."],
      ["많이 [달라졌어요].", "Es hat sich viel verändert.", "달라요 → 달라졌어요"]
    ] },
    "a2-10n4": { mehr: "처럼 steht direkt hinter dem Nomen, egal ob Konsonant oder Vokal. Es ist das „wie“ beim Vergleich mit etwas Ähnlichem. Vor einem Nomen heißt es stattdessen 같은: 가족 같은 친구 (ein Freund wie Familie).", bsp: [
      ["아이[처럼] 좋아해요.", "Er freut sich wie ein Kind."],
      ["오늘은 여름[처럼] 더워요.", "Heute ist es heiß wie im Sommer."],
      ["가수[처럼] 노래를 잘해요.", "Sie singt so gut wie eine Sängerin."],
      ["평소[처럼] 하면 돼요.", "Machen Sie es einfach wie immer."],
      ["가족 [같은] 친구예요.", "Er ist ein Freund wie Familie.", "vor einem Nomen: 같은"]
    ] },
    "a2-10n5": { mehr: "Stamm + 게: 맛있다 → 맛있게, 크다 → 크게, 예쁘다 → 예쁘게. Einige Wörter haben eine eigene Form: 많이 (viel), 빨리 (schnell), 천천히 (langsam), 조용히 (leise), 멀리 (weit). Mit 해 주세요 bestellt man, wie etwas werden soll – beim Friseur oder im Lokal. Feste Wünsche: 맛있게 드세요, 재미있게 보세요, 따뜻하게 입으세요.", bsp: [
      ["[맛있게] 드세요.", "Guten Appetit.", "wörtlich: Essen Sie mit Genuss."],
      ["[재미있게] 놀았어요.", "Wir hatten viel Spaß."],
      ["[따뜻하게] 입으세요.", "Ziehen Sie sich warm an."],
      ["[싸게] 샀어요.", "Ich habe es günstig gekauft."],
      ["좀 더 [쉽게] 설명해 주세요.", "Erklären Sie es bitte etwas einfacher."],
      ["[늦게] 와서 죄송해요.", "Entschuldigung, dass ich spät komme."]
    ] },

    // ---------- a2-11 Wem, von wem, nur, jeder ----------
    "a2-11n1": { mehr: "한테 markiert die Person, an die etwas geht – bei geben, sagen, schicken, fragen, zeigen, anrufen, beibringen. 한테 ist gesprochen, 에게 geschrieben. 께 ehrt Ältere; dann steht meist auch 드리다 statt 주다. Bei Orten und Firmen nimmt man 에 (회사에 전화했어요). „Mir“ heißt 저한테, vertraut 나한테.", bsp: [
      ["친구[한테] 메시지를 보냈어요.", "Ich habe einem Freund eine Nachricht geschickt."],
      ["아이[한테] 책을 읽어 줘요.", "Ich lese dem Kind ein Buch vor."],
      ["선생님[께] 물어보세요.", "Fragen Sie die Lehrerin.", "ehrend: 께"],
      ["저[한테] 전화하세요.", "Rufen Sie mich an."],
      ["누구[한테] 줄 거예요?", "Wem gibst du das?"],
      ["부모님[께] 전화드렸어요.", "Ich habe die Eltern angerufen.", "께 zusammen mit 드리다"]
    ] },
    "a2-11n2": { mehr: "Bei bekommen, hören, lernen und ausleihen markiert 한테서 die Person, von der etwas kommt. Geschrieben: 에게서. Im Gespräch fällt 서 oft weg; dann sieht es aus wie „an wen“, und das Verb zeigt die Richtung. Bei Orten und Firmen nimmt man 에서 (회사에서 받았어요). Ehrend: 께.", bsp: [
      ["어머니[한테서] 전화가 왔어요.", "Die Mutter hat angerufen.", "wörtlich: Von der Mutter ist ein Anruf gekommen."],
      ["친구[한테서] 선물을 받았어요.", "Ich habe von einem Freund ein Geschenk bekommen."],
      ["누구[한테서] 들었어요?", "Von wem hast du das gehört?"],
      ["친구[한테] 책을 빌렸어요.", "Ich habe mir von einem Freund ein Buch ausgeliehen.", "ohne 서; 빌리다 zeigt die Richtung"],
      ["선생님[께] 한국어를 배웠어요.", "Ich habe bei der Lehrerin Koreanisch gelernt.", "ehrend: 께"]
    ] },
    "a2-11n3": { mehr: "만 steht hinter dem Wort und heißt „nur“. Es ersetzt 이/가 und 을/를; hinter anderen Partikeln bleibt es stehen (저한테만, 집에서만). 밖에 heißt wörtlich „außer“ und braucht immer eine Verneinung dahinter (없어요, 안, 못, 몰라요): 하나밖에 없어요 = es gibt nur eines. 밖에 klingt nach „leider nur, mehr nicht“; 만 ist neutral.", bsp: [
      ["저[만] 몰랐어요.", "Nur ich habe es nicht gewusst."],
      ["주말에[만] 시간이 있어요.", "Ich habe nur am Wochenende Zeit.", "만 hinter 에"],
      ["하나[밖에] 안 남았어요.", "Es ist nur noch eines übrig.", "밖에 braucht eine Verneinung"],
      ["오 분[밖에] 안 걸려요.", "Es dauert nur fünf Minuten."],
      ["이것[만] 하면 끝나요.", "Nur noch das hier, dann bin ich fertig."],
      ["너[밖에] 없어.", "Ich habe nur dich.", "vertraut; wörtlich: Außer dir gibt es niemanden."]
    ] },
    "a2-11n4": { kv: true, mehr: "마다 = jeder einzelne: 날마다, 주말마다, 사람마다 (von Mensch zu Mensch), 십 분마다 (alle zehn Minuten). 쯤 = ungefähr, hinter Zahl oder Zeit: 세 시쯤, 만 원쯤. (이)나 zwischen zwei Nomen = oder; nach Konsonant 이나, nach Vokal 나. Hinter einer Menge heißt (이)나 „ganze …“, also überraschend viel: 세 시간이나.", bsp: [
      ["사람[마다] 달라요.", "Das ist bei jedem anders."],
      ["버스가 십 분[마다] 와요.", "Der Bus kommt alle zehn Minuten."],
      ["몇 시[쯤] 올 거예요?", "Um wie viel Uhr ungefähr kommst du?"],
      ["토요일[이나] 일요일에 만나요.", "Treffen wir uns am Samstag oder Sonntag.", "일 hat unten ㄹ → 이나"],
      ["버스[나] 지하철을 타세요.", "Nehmen Sie den Bus oder die U-Bahn.", "스 endet auf Vokal → 나"],
      ["두 시간[이나] 기다렸어요.", "Ich habe ganze zwei Stunden gewartet.", "hinter einer Menge: überraschend viel"]
    ] },

    // ---------- a2-12 Im Gespräch bleiben ----------
    "a2-12n1": { mehr: "Stamm + 지요, gesprochen 죠. Vergangenheit: -았죠 / -었죠. Nomen: (이)죠. Vier Aufgaben: 1. Frage, bei der man ein Ja erwartet (맛있죠?). 2. Bestätigung im Sinn von „natürlich“ (알죠). 3. Mit Fragewort eine weichere Frage (어디죠? 얼마죠?). 4. Mit -(으)시- ein höflicher Vorschlag (가시죠).", bsp: [
      ["한국 음식 [좋아하죠]?", "Sie mögen koreanisches Essen, oder?"],
      ["어제 많이 [바빴죠]?", "Gestern war viel los, oder?", "Vergangenheit: 바빴 + 죠"],
      ["화장실이 [어디죠]?", "Wo ist denn die Toilette?", "mit Fragewort: weichere Frage"],
      ["그럼요, [알죠].", "Natürlich weiß ich das."],
      ["이거 [얼마죠]?", "Was kostet das noch gleich?"],
      ["같이 [가시죠].", "Gehen wir doch zusammen.", "höflicher Vorschlag"]
    ] },
    "a2-12n2": { mehr: "Stamm + 거든요. Vergangenheit: -았거든요 / -었거든요. Nomen: (이)거든요. Es steht im zweiten Satz und erklärt den ersten – mit einem Grund, den der andere noch nicht kennt. Man leitet damit auch eine Erzählung ein: „Es war nämlich so …“. Gegenüber Älteren kann -거든요 belehrend klingen; dort sagt man lieber -아서요.", bsp: [
      ["먼저 갈게요. 내일 일찍 [일어나야 하거든요].", "Ich gehe schon. Ich muss morgen nämlich früh aufstehen."],
      ["저는 안 먹을게요. 배가 [부르거든요].", "Ich esse nichts. Ich bin nämlich satt."],
      ["길을 잘 몰라요. 여기 [처음이거든요].", "Ich kenne den Weg nicht. Ich bin nämlich zum ersten Mal hier.", "Nomen + 이거든요"],
      ["조용히 해 주세요. 아이가 [자거든요].", "Seien Sie bitte leise. Das Kind schläft nämlich."],
      ["어제 못 갔어요. 몸이 안 [좋았거든요].", "Gestern konnte ich nicht kommen. Mir ging es nämlich nicht gut.", "Vergangenheit: 좋았 + 거든요"]
    ] },
    "a2-12n3": { mehr: "Eigenschaftswort und Vergangenheit: Stamm + 군요 (예쁘군요, 그랬군요). Verb in der Gegenwart: 는군요 (잘하시는군요). Nomen: (이)군요. Vertraut heißt es -구나, beim Verb -는구나; so spricht man zu Kindern und zu sich selbst. Unterschied zu -네요: -네요 sagt man bei dem, was man gerade selbst wahrnimmt, -군요 auch bei dem, was man eben erfahren hat. Am häufigsten sind 그렇군요 und 그랬구나.", bsp: [
      ["아, [그랬군요].", "Ach, so war das.", "Vergangenheit"],
      ["한국어를 [잘하시는군요].", "Sie sprechen ja gut Koreanisch.", "Verb, Gegenwart → 는군요"],
      ["벌써 [왔구나]!", "Du bist ja schon da!", "vertraut"],
      ["많이 [컸구나].", "Bist du aber gewachsen.", "vertraut, zum Kind"],
      ["그래서 [늦었군요].", "Deshalb sind Sie also zu spät gekommen."],
      ["많이 [힘들었구나].", "Das war sehr schwer für dich.", "vertraut; zeigt Mitgefühl"]
    ] },
    "a2-12n4": { mehr: "Im Koreanischen spricht der Zuhörer mit: Kurze Antworten zeigen, dass man folgt. 네 heißt dabei oft nur „ich höre zu“, nicht „ich stimme zu“. 그래요? · 정말요? · 진짜요? = wirklich? 그럼요 · 맞아요 = Zustimmung. 글쎄요 = Zögern, auch ein höfliches Nein. 그러게요 = „ja, eben“. Ein angehängtes 요 macht jede Kurzantwort höflich: 왜요? · 저도요. · 어디요?", bsp: [
      ["[맞아요].", "Stimmt genau."],
      ["[진짜요]?", "Echt?"],
      ["[저도요].", "Ich auch.", "요 macht jede Kurzantwort höflich"],
      ["[왜요]?", "Warum denn?"],
      ["[아이고], 어떡해요.", "Oje, was machen wir da."],
      ["[그러게요].", "Ja, eben.", "man stimmt einer Feststellung oder Klage zu"]
    ] }
  }
});
