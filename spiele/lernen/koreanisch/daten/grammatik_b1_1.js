// grammatik_b1_1.js — Grammatikteil zu B1, Teil 1 (Lektionen b1-01 … b1-12): zwei Übersichtsseiten und zu jeder Regel
// eine genauere Erklärung mit Beispielen. Aufbau und Regeln wie in grammatik.js: Beispiele nur ANS ENDE anhängen,
// nichts umreihen, nichts löschen (stilllegen mit null). Kennung eines Beispiels = Schlüssel + "b" + Platz.
// kv: "stamm" = die Form hängt davon ab, ob der Verbstamm auf Konsonant oder Vokal endet.
KO.grammatik({
  grund: [
    { id: "g-schrift", titel: "Schriftform: Sätze auf 다", kurz: "Wie Sätze in Zeitungen, Büchern und Aufsätzen enden – und woran man die Formen erkennt.",
      text: [
        "Geschriebene Texte für alle – Zeitung, Sachbuch, Aufsatz, Tagebuch, Prüfungstext – verwenden weder 요 noch 습니다. Die Sätze enden auf 다. Die Form ist neutral: Sie spricht niemanden an.",
        "Wichtig ist die Gegenwart. Bei Verben kommt ㄴ oder 는 vor das 다. Eigenschaftswörter bleiben in der Grundform."
      ],
      tabelle: [
        ["", "Gegenwart", "Vergangenheit", "Zukunft"],
        ["Verb nach Vokal", "간다", "갔다", "갈 것이다"],
        ["Verb nach Konsonant", "먹는다", "먹었다", "먹을 것이다"],
        ["Eigenschaftswort", "좋다 · 크다", "좋았다 · 컸다", "좋을 것이다"],
        ["있다 · 없다", "있다 · 없다", "있었다", "있을 것이다"],
        ["Nomen", "학생이다 · 의사다", "학생이었다 · 의사였다", "학생일 것이다"],
        ["Verneinung", "가지 않는다 · 좋지 않다", "가지 않았다", "가지 않을 것이다"]
      ],
      danach: [
        "Stämme auf ㄹ verlieren das ㄹ: 살다 → 산다, 만들다 → 만든다, 알다 → 안다.",
        "Fragen stehen in geschriebenen Texten selten. Wenn doch: Verb + 는가? (가는가?), Eigenschaftswort + (으)ㄴ가? (좋은가?), Nomen + 인가? (무엇인가?).",
        "Dieselben Formen braucht man im Gespräch an zwei Stellen: beim Weitersagen (온다고 했어요, 좋다고 해요) und im vertrauten Selbstgespräch (아, 덥다! · 맛있다!)."
      ],
      bsp: [
        ["나는 매일 일곱 시에 [일어난다].", "Ich stehe jeden Tag um sieben auf.", "Verb nach Vokal → ㄴ다"],
        ["아이는 책을 많이 [읽는다].", "Das Kind liest viel.", "Verb nach Konsonant → 는다"],
        ["이 집은 [넓다].", "Diese Wohnung ist geräumig.", "Eigenschaftswort → Grundform"],
        ["어제 친구를 [만났다].", "Gestern habe ich einen Freund getroffen.", "Vergangenheit → 았다"],
        ["그는 [의사다].", "Er ist Arzt.", "Nomen nach Vokal → 다"],
        ["내일은 비가 [올 것이다].", "Morgen wird es regnen.", "Zukunft → ㄹ 것이다"]
      ],
      siehe: ["b1-05n1", "b1-05n2", "b1-05n3", "b1-05n4", "g-weitersagen", "g-stufen"] },

    { id: "g-binden", titel: "Bindeformen im Überblick", kurz: "Alle Arten, zwei Satzteile zu verbinden, nach Bedeutung geordnet – mit dem Unterschied zwischen ähnlichen Formen.",
      text: [
        "Koreanisch verbindet Satzteile nicht mit eigenen Wörtern wie „weil“ oder „obwohl“, sondern mit einer Endung am ersten Verb. Für jede Bedeutung gibt es mehrere Endungen, die sich im Ton und in der Verwendung unterscheiden."
      ],
      tabelle: [
        ["Bedeutung", "Form", "Unterschied"],
        ["Grund", "-아서", "neutral"],
        ["", "-(으)니까", "vor Bitte und Vorschlag"],
        ["", "때문에", "störend"],
        ["", "-는 바람에", "unerwartet und unerwünscht"],
        ["", "(으)로 인해", "sachlich, geschrieben"],
        ["", "덕분에", "erfreulich"],
        ["Gegensatz", "-지만", "klar"],
        ["", "-는데", "weich, am häufigsten"],
        ["", "-기는 하지만", "mit Zugeständnis"],
        ["", "-(으)ㄴ/는 반면에", "zwei Seiten einer Sache"],
        ["Bedingung", "-(으)면", "allgemein"],
        ["", "-(으)려면", "wenn man etwas will"],
        ["", "-(으)ㄹ 경우에", "sachlich, in Regeln"],
        ["", "-아야", "nur wenn"],
        ["Zugeständnis", "-아도", "auch wenn"],
        ["", "-더라도", "selbst wenn"],
        ["Zeit", "-기 전에", "bevor"],
        ["", "-(으)ㄴ 후에", "nachdem"],
        ["", "-(으)ㄹ 때", "als, wenn"],
        ["", "-자마자", "sobald"],
        ["", "-는 대로", "sobald (kommt noch)"],
        ["", "-다가", "mittendrin"],
        ["", "-(으)면서", "gleichzeitig"],
        ["Zweck", "-(으)러", "nur mit gehen und kommen"],
        ["", "-(으)려고", "gesprochen"],
        ["", "-기 위해서", "sachlich"],
        ["", "-도록", "damit"],
        ["Hinzufügen", "-고", "und"],
        ["", "-거나", "oder"],
        ["", "-(으)ㄹ 뿐만 아니라", "nicht nur, sondern auch"],
        ["", "-(으)ㄴ/는 데다가", "noch dazu"],
        ["Maß", "-(으)ㄹ수록", "je … desto"],
        ["", "-(으)ㄴ/는 만큼", "so viel wie"]
      ],
      danach: [
        "Faustregel für den Alltag: Mit -아서, -는데, -(으)면 und -고 kommt man im Gespräch fast überall durch. Die übrigen Formen muss man vor allem erkennen, wenn man sie hört oder liest."
      ],
      bsp: [
        ["비가 [와서] 못 갔어요.", "Es hat geregnet, deshalb konnte ich nicht hin.", "neutraler Grund"],
        ["비가 [오니까] 우산을 가져가세요.", "Es regnet, nehmen Sie einen Schirm mit.", "Grund vor einer Aufforderung"],
        ["비 [때문에] 못 갔어요.", "Wegen des Regens konnte ich nicht hin.", "störender Grund, Nomen"],
        ["비가 [오는 바람에] 다 젖었어요.", "Weil es plötzlich geregnet hat, bin ich ganz nass geworden.", "unerwartet und unerwünscht"],
        ["비[로 인해] 경기가 취소됐습니다.", "Wegen des Regens wurde das Spiel abgesagt.", "sachlich, wie in einer Durchsage"],
        ["비 [덕분에] 시원해졌어요.", "Dank dem Regen ist es angenehm kühl geworden.", "erfreulicher Grund"]
      ],
      siehe: ["g-anschluss", "a2-01n1", "a2-01n2", "a2-02n2", "a2-03n1", "b1-02n4", "b1-03n1", "b1-03n4", "b1-06n2", "b1-07n1", "b1-10n3", "b1-06n4"] }
  ],

  regeln: {
    // ---------- b1-01 Meinung sagen ----------
    "b1-01n1": { mehr: "Die Meinung steht in der Form des Weitersagens: Verb -ㄴ다고 / -는다고, Eigenschaftswort -다고, Nomen (이)라고, Vergangenheit -았다고, Zukunft -(으)ㄹ 거라고. Dahinter 생각해요. Weicher klingt -(으)ㄴ/는 것 같아요, entschiedener -다고 봐요 („ich sehe es so“). Widerspruch: 저는 그렇게 생각하지 않아요.", verweis: "g-weitersagen", bsp: [
      ["그 말이 [옳다고 생각해요].", "Ich finde, das ist richtig."],
      ["건강이 제일 [중요하다고 생각해요].", "Ich finde, Gesundheit ist das Wichtigste."],
      ["아이들은 많이 [놀아야 한다고 생각해요].", "Ich finde, Kinder sollen viel spielen.", "하다 → 한다고"],
      ["그건 [문제라고 생각해요].", "Ich halte das für ein Problem.", "Nomen → 라고"],
      ["잘 [될 거라고 생각해요].", "Ich denke, es wird gut gehen.", "Zukunft → 될 거라고"],
      ["저는 그렇게 [생각하지 않아요].", "Das sehe ich nicht so."]
    ] },
    "b1-01n2": { mehr: "Stamm + 기는, danach 하지만 oder das Wort noch einmal (좋기는 좋지만). Im Gespräch verkürzt zu 긴 und oft mit -는데 statt -지만: 좋긴 한데. Vergangenheit: -기는 했지만. Man gibt dem anderen zuerst recht und nennt dann den Einwand – höflicher als ein bloßes „aber“.", bsp: [
      ["[비싸기는 하지만] 품질이 좋아요.", "Teuer ist es schon, aber die Qualität ist gut."],
      ["[먹기는 했는데] 배가 안 불러요.", "Gegessen habe ich schon, aber ich bin nicht satt.", "Vergangenheit: 기는 했는데"],
      ["[알긴 하는데] 잘은 몰라요.", "Ich kenne es schon, aber nicht gut.", "gesprochen: 긴"],
      ["[춥긴 한데] 기분은 좋아요.", "Kalt ist es schon, aber die Stimmung ist gut."],
      ["[가고 싶기는 하지만] 시간이 없어요.", "Hingehen möchte ich schon, aber ich habe keine Zeit."],
      ["[좋기는 좋은데] 좀 멀어요.", "Gut ist es schon, nur etwas weit.", "mit Wiederholung des Wortes"]
    ] },
    "b1-01n3": { mehr: "Stamm + 는 게 낫다; 게 ist kurz für 것이. 낫다 (besser sein) ist unregelmäßig: 나아요, 나은, 나을 것 같아요, 낫겠어요. Womit man vergleicht, steht mit 보다 davor. Unterschied zu -는 게 좋겠어요: Das ist ein Rat; -는 게 낫다 wägt zwei Möglichkeiten gegeneinander ab. 차라리 davor heißt „dann lieber gleich“.", verweis: "g-unreg", bsp: [
      ["지금 [가는 게 나아요].", "Es ist besser, jetzt zu gehen."],
      ["기다리는 것보다 [전화하는 게 낫겠어요].", "Anrufen ist besser als warten."],
      ["모르면 [물어보는 게 나아요].", "Wenn man etwas nicht weiß, fragt man besser."],
      ["차라리 [안 하는 게 낫겠어요].", "Dann lassen wir es lieber."],
      ["이것보다 저게 더 [나아요].", "Das dort ist besser als das hier.", "낫다 → 나아요"],
      ["어느 쪽이 더 [나을까요]?", "Was wäre besser?"]
    ] },
    "b1-01n4": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 만하다, nach Konsonant 을 만하다. Zwei Bedeutungen. Erstens: Es lohnt sich (볼 만해요 = sehenswert). Zweitens: Es geht gerade noch (참을 만해요 = auszuhalten, 먹을 만해요 = essbar). Oft mit -아/어 보다: 가 볼 만해요. Vor einem Nomen: -(으)ㄹ 만한.", bsp: [
      ["이 책은 [읽을 만해요].", "Dieses Buch ist lesenswert.", "읽 → 을 만해요"],
      ["제주도는 한번 [가 볼 만해요].", "Jeju ist eine Reise wert."],
      ["[먹을 만해요]?", "Kann man es essen?", "hier: gerade gut genug"],
      ["아직 [참을 만해요].", "Es ist noch auszuhalten."],
      ["[추천할 만한] 곳 있어요?", "Gibt es einen Ort, den Sie empfehlen können?", "vor dem Nomen: 만한"],
      ["[그럴 만해요].", "Das ist verständlich.", "wörtlich: Das kann gut so sein."]
    ] },

    // ---------- b1-02 Begründen und abwägen ----------
    "b1-02n1": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 뿐만 아니라, nach Konsonant 을 뿐만 아니라. Vergangenheit: -았을 뿐만 아니라. Hinter einem Nomen: Nomen + 뿐만 아니라. Im zweiten Teil steht meist 도 (auch). Kürzer: -(으)ㄹ 뿐 아니라. 뿐 allein heißt „nur“: 그것뿐이에요.", bsp: [
      ["그 사람은 [친절할 뿐만 아니라] 일도 잘해요.", "Er ist nicht nur freundlich, er arbeitet auch gut."],
      ["값이 [쌀 뿐만 아니라] 맛도 좋아요.", "Es ist nicht nur billig, es schmeckt auch gut."],
      ["아이[뿐만 아니라] 어른도 좋아해요.", "Nicht nur Kinder, auch Erwachsene mögen es.", "Nomen + 뿐만 아니라"],
      ["비가 [올 뿐만 아니라] 바람도 불어요.", "Es regnet nicht nur, es weht auch der Wind."],
      ["한국어를 [읽을 뿐만 아니라] 쓸 수도 있어요.", "Ich kann Koreanisch nicht nur lesen, sondern auch schreiben.", "읽 → 을"],
      ["저는 그것[뿐]이에요.", "Bei mir ist das alles.", "뿐 allein = nur"]
    ] },
    "b1-02n2": { kv: "stamm", mehr: "Verb in der Gegenwart: Stamm + 는 반면에. Eigenschaftswort und Verb in der Vergangenheit: Stamm + ㄴ 반면에, nach Konsonant 은. 에 kann wegfallen. Man beschreibt zwei Seiten derselben Sache oder zwei Dinge im Vergleich. Am Satzanfang als eigenes Wort: 반면에.", verweis: "g-vornomen", bsp: [
      ["이 일은 [힘든 반면에] 보람이 있어요.", "Diese Arbeit ist anstrengend, dafür erfüllend.", "힘들다: ㄹ fällt weg → 힘든"],
      ["형은 [조용한 반면에] 동생은 활발해요.", "Der ältere Bruder ist ruhig, der jüngere dagegen lebhaft."],
      ["수입은 [늘어난 반면에] 저축은 줄었어요.", "Die Einnahmen sind gestiegen, das Ersparte ist dagegen geschrumpft.", "Verb, vorbei → ㄴ"],
      ["말은 [잘하는 반면에] 글은 잘 못 써요.", "Er spricht gut, schreibt dagegen nicht so gut.", "Verb, jetzt → 는"],
      ["지하철은 [빠른 반면에] 사람이 많아요.", "Die U-Bahn ist schnell, dafür voll."],
      ["[반면에] 단점도 있어요.", "Andererseits gibt es auch Nachteile.", "am Satzanfang"]
    ] },
    "b1-02n3": { mehr: "에 비해서 steht hinter dem Nomen, an dem man misst; 서 kann wegfallen. 에 비하면 heißt „wenn man es mit … vergleicht“. Unterschied zu 보다: 보다 vergleicht zwei Dinge direkt (A보다 B가 커요). 에 비해 setzt ein Maß – deutsch oft „für“: 나이에 비해 = für sein Alter.", bsp: [
      ["서울[에 비해서] 조용해요.", "Im Vergleich zu Seoul ist es ruhig."],
      ["다른 나라[에 비해] 물가가 비싼 편이에요.", "Im Vergleich zu anderen Ländern sind die Preise eher hoch."],
      ["크기[에 비해] 가벼워요.", "Für seine Größe ist es leicht."],
      ["노력[에 비해] 결과가 안 좋아요.", "Gemessen am Aufwand ist das Ergebnis schlecht."],
      ["예전[에 비하면] 많이 편해졌어요.", "Verglichen mit früher ist es viel bequemer geworden.", "에 비하면 = wenn man vergleicht"],
      ["형[에 비해] 동생이 키가 커요.", "Verglichen mit dem älteren Bruder ist der jüngere groß."]
    ] },
    "b1-02n4": { mehr: "Stamm + 더라도. Vergangenheit: -았더라도. Es ist stärker und gedachter als -아도/어도: „selbst angenommen, dass“. Oft mit 아무리 (egal wie) oder 혹시 (falls doch). Im zweiten Teil steht meist ein Vorsatz, eine Bitte oder eine Feststellung, die trotzdem gilt.", bsp: [
      ["[바쁘더라도] 밥은 꼭 먹어요.", "Auch wenn ich viel zu tun habe, esse ich auf jeden Fall."],
      ["아무리 [화가 나더라도] 그러면 안 돼요.", "Egal wie wütend man ist, das darf man nicht."],
      ["혹시 [늦더라도] 기다려 주세요.", "Warten Sie bitte, auch falls ich mich verspäte."],
      ["[실패하더라도] 다시 하면 돼요.", "Selbst wenn es misslingt, kann man es noch einmal versuchen."],
      ["누가 [뭐라고 하더라도] 저는 할 거예요.", "Egal, was wer sagt, ich mache es."],
      ["[비싸더라도] 좋은 걸로 사세요.", "Kaufen Sie etwas Gutes, auch wenn es teuer ist."]
    ] },

    // ---------- b1-03 Erzählen: was passiert ist ----------
    "b1-03n1": { mehr: "Stamm + 다가, kurz 다. Beide Teile haben dieselbe handelnde Person. Drei Verwendungen: Eine Handlung wird von etwas unterbrochen (먹다가 전화를 받았어요). Eine Handlung geht in eine andere über – so beschreibt man Wege (가다가 오른쪽으로). Als Warnung: Wenn du so weitermachst, passiert etwas (뛰다가 넘어져요). Mit Vergangenheit, -았다가, ist die erste Handlung abgeschlossen und wird rückgängig gemacht: 갔다가 왔어요 (hin und zurück).", bsp: [
      ["밥을 [먹다가] 전화를 받았어요.", "Ich war beim Essen, da kam ein Anruf."],
      ["[공부하다가] 잠이 들었어요.", "Ich bin beim Lernen eingeschlafen."],
      ["이쪽으로 [가다가] 오른쪽으로 가세요.", "Gehen Sie hier entlang und dann nach rechts.", "bei Wegbeschreibungen"],
      ["비가 [오다가] 그쳤어요.", "Es hat geregnet und dann aufgehört."],
      ["그렇게 [뛰다가] 넘어져요.", "Wenn du so läufst, fällst du hin.", "als Warnung"],
      ["가게에 [갔다가] 왔어요.", "Ich war kurz im Geschäft und bin wieder da.", "았다가: hin und wieder zurück"]
    ] },
    "b1-03n2": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 뻔했어요, nach Konsonant 을 뻔했어요. Es steht immer in der Vergangenheit: Etwas wäre fast passiert, ist aber nicht passiert. Meist geht es um etwas Unangenehmes. 하마터면 am Satzanfang verstärkt: um ein Haar.", bsp: [
      ["차에 [부딪힐 뻔했어요].", "Ich wäre fast mit einem Auto zusammengestoßen."],
      ["지갑을 [잃어버릴 뻔했어요].", "Ich hätte fast die Geldbörse verloren."],
      ["약속을 [잊을 뻔했어요].", "Ich hätte die Verabredung fast vergessen.", "잊 → 을 뻔"],
      ["기차를 [못 탈 뻔했어요].", "Ich hätte den Zug fast nicht erwischt."],
      ["너무 놀라서 [소리 지를 뻔했어요].", "Vor Schreck hätte ich fast geschrien."],
      ["하마터면 [늦을 뻔했어요].", "Um ein Haar wäre ich zu spät gekommen."]
    ] },
    "b1-03n3": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 버리다. Die Handlung ist ganz zu Ende und lässt sich nicht zurücknehmen. Welches Gefühl mitschwingt, zeigt der Zusammenhang: Erleichterung (다 끝내 버렸어요 = endlich erledigt) oder Bedauern (가 버렸어요 = leider weg). 잊어버리다 (vergessen) und 잃어버리다 (verlieren) sind daraus entstandene feste Wörter.", verweis: "g-anschluss", bsp: [
      ["숙제를 다 [해 버렸어요].", "Ich habe die Hausaufgabe ganz erledigt.", "Erleichterung"],
      ["버스가 [가 버렸어요].", "Der Bus ist weg.", "Bedauern"],
      ["비밀을 [말해 버렸어요].", "Ich habe das Geheimnis ausgeplaudert."],
      ["너무 피곤해서 [자 버렸어요].", "Ich war so müde, dass ich eingeschlafen bin."],
      ["돈을 다 [써 버렸어요].", "Ich habe das ganze Geld ausgegeben."],
      ["그냥 [잊어버리세요].", "Vergessen Sie es einfach.", "잊어버리다 ist ein festes Wort"]
    ] },
    "b1-03n4": { mehr: "Stamm + 자마자, nur bei Verben. Davor steht keine Vergangenheit; die Zeit zeigt das Satzende. Die beiden Teile können verschiedene Personen haben. Ähnlich: -는 대로 (sobald) – das geht aber nur für etwas, das noch kommt.", bsp: [
      ["소식을 [듣자마자] 전화했어요.", "Sobald ich die Nachricht gehört hatte, habe ich angerufen."],
      ["아이가 [눕자마자] 잠들었어요.", "Kaum lag das Kind, ist es eingeschlafen."],
      ["수업이 [끝나자마자] 집에 갔어요.", "Gleich nach dem Unterricht bin ich heimgegangen."],
      ["[받자마자] 확인해 주세요.", "Sehen Sie es bitte an, sobald Sie es bekommen."],
      ["[먹자마자] 눕지 마세요.", "Legen Sie sich nicht gleich nach dem Essen hin."],
      ["한국에 [오자마자] 감기에 걸렸어요.", "Kaum war ich in Korea, habe ich mich erkältet."]
    ] },

    // ---------- b1-04 Rückblick ----------
    "b1-04n1": { mehr: "Stamm + 더라고요. Man berichtet, was man selbst gesehen, gehört oder gespürt hat – über andere Menschen, Dinge, Orte. Für das eigene Handeln geht es nicht, für die eigene Empfindung schon (기분이 좋더라고요). Mit Vergangenheit, -았더라고요, war etwas schon geschehen, als man es bemerkte. Vertraut: -더라.", bsp: [
      ["그 식당 [맛있더라고요].", "Das Lokal war gut, fand ich."],
      ["생각보다 [멀더라고요].", "Es war weiter als gedacht."],
      ["아이가 혼자 잘 [놀더라고요].", "Das Kind hat schön allein gespielt, habe ich gesehen."],
      ["가 보니까 문을 [닫았더라고요].", "Als ich hinkam, war schon zu.", "Vergangenheit: schon geschehen"],
      ["한국 사람들은 정말 빨리 [걷더라고요].", "Koreaner gehen wirklich schnell, ist mir aufgefallen."],
      ["직접 해 보니까 [어렵더라고요].", "Als ich es selbst probiert habe, war es schwer."]
    ] },
    "b1-04n2": { mehr: "-던 hängt direkt am Stamm und beschreibt aus der Erinnerung: etwas, das man über längere Zeit oder wiederholt getan hat (다니던 학교), oder etwas, das noch nicht zu Ende war (마시던 커피 = der angefangene Kaffee). -았던 / -었던 beschreibt etwas Einmaliges oder Abgeschlossenes, das jetzt nicht mehr so ist (갔던 곳). Bei Eigenschaftswörtern steht für Vergangenes -았던 (좋았던 기억). Zum Vergleich: -(으)ㄴ nennt nur die Tatsache (간 곳), ohne den Blick zurück.", verweis: "g-vornomen", bsp: [
      ["제가 [다니던] 학교예요.", "Das ist die Schule, in die ich gegangen bin.", "über längere Zeit → 던"],
      ["아까 [마시던] 커피 어디 있어요?", "Wo ist der Kaffee, den ich vorhin getrunken habe?", "noch nicht ausgetrunken → 던"],
      ["어제 [봤던] 영화 제목이 뭐예요?", "Wie heißt der Film, den wir gestern gesehen haben?", "einmal, abgeschlossen → 았던"],
      ["작년에 [갔던] 곳에 또 가고 싶어요.", "Ich möchte wieder dorthin, wo wir letztes Jahr waren."],
      ["[좋았던] 기억이 많아요.", "Ich habe viele schöne Erinnerungen.", "Eigenschaftswort, vorbei → 았던"],
      ["어릴 때 자주 [듣던] 노래예요.", "Das ist ein Lied, das ich als Kind oft gehört habe."]
    ] },
    "b1-04n3": { kv: "stamm", mehr: "Aufbau: Beschreibungsform + 줄 알았어요 (dachte fälschlich) oder 줄 몰랐어요 (wusste nicht). Verb, jetzt: 는 줄. Verb, vorbei, und Eigenschaftswort: (으)ㄴ 줄. Erwartung: (으)ㄹ 줄. Nomen: 인 줄. Nicht verwechseln mit -(으)ㄹ 줄 알아요 in der Gegenwart: Das heißt „können“ (운전할 줄 알아요).", verweis: "g-vornomen", bsp: [
      ["비가 [오는 줄 몰랐어요].", "Ich wusste nicht, dass es regnet.", "Verb, jetzt → 는 줄"],
      ["저는 [한국 사람인 줄 알았어요].", "Ich dachte, Sie sind Koreaner.", "Nomen → 인 줄"],
      ["이렇게 [어려운 줄 몰랐어요].", "Ich wusste nicht, dass es so schwer ist.", "Eigenschaftswort → 운 줄"],
      ["다 [끝난 줄 알았어요].", "Ich dachte, es ist schon vorbei.", "Verb, vorbei → ㄴ 줄"],
      ["이렇게 사람이 [많을 줄 몰랐어요].", "Ich hätte nicht gedacht, dass so viele Leute da sind.", "Erwartung → 을 줄"],
      ["벌써 [자는 줄 알았어요].", "Ich dachte, du schläfst schon."]
    ] },
    "b1-04n4": { mehr: "Bildung: Vergangenheit + 더니 (먹었더니, 갔더니). Im ersten Teil handelt man selbst; im zweiten steht, was man daraufhin bemerkt hat – eine Folge oder die Reaktion eines anderen. Ohne 았, also Stamm + 더니, beschreibt man eine Veränderung, die man an etwas anderem beobachtet hat (아침에는 춥더니 지금은 따뜻해요).", bsp: [
      ["일찍 [잤더니] 몸이 가벼워요.", "Ich bin früh schlafen gegangen, jetzt fühle ich mich leicht."],
      ["많이 [걸었더니] 다리가 아파요.", "Ich bin viel gegangen, jetzt tun mir die Beine weh."],
      ["친구한테 [물어봤더니] 모른다고 했어요.", "Ich habe einen Freund gefragt, er wusste es nicht."],
      ["문을 [열었더니] 아무도 없었어요.", "Als ich die Tür aufmachte, war niemand da."],
      ["매일 [연습했더니] 발음이 좋아졌어요.", "Ich habe täglich geübt, da ist die Aussprache besser geworden."],
      ["아침에는 [춥더니] 지금은 따뜻하네요.", "In der Früh war es kalt, jetzt ist es ja warm.", "ohne 았: an etwas anderem beobachtet"]
    ] },

    // ---------- b1-05 Nachrichten verstehen ----------
    "b1-05n1": { kv: "stamm", mehr: "Verb in der Gegenwart: Stamm + ㄴ다 nach Vokal (가다 → 간다), 는다 nach Konsonant (먹다 → 먹는다); Stämme auf ㄹ verlieren es (살다 → 산다). Eigenschaftswörter, 있다 und 없다 bleiben in der Grundform (좋다, 있다). Vergangenheit: -았다 / -었다. Zukunft: -(으)ㄹ 것이다. Nomen: (이)다. Die Form steht in Zeitungen, Büchern, Aufsätzen und im Tagebuch.", verweis: "g-schrift", bsp: [
      ["나는 매일 아침 커피를 [마신다].", "Ich trinke jeden Morgen Kaffee.", "Verb nach Vokal → ㄴ다"],
      ["한국 사람들은 김치를 자주 [먹는다].", "Koreaner essen oft Kimchi.", "Verb nach Konsonant → 는다"],
      ["오늘은 날씨가 [좋다].", "Heute ist das Wetter schön.", "Eigenschaftswort → Grundform"],
      ["어제는 비가 많이 [왔다].", "Gestern hat es viel geregnet.", "Vergangenheit → 왔다"],
      ["서울은 한국의 [수도이다].", "Seoul ist die Hauptstadt Koreas.", "Nomen → 이다"],
      ["나는 고기를 [먹지 않는다].", "Ich esse kein Fleisch.", "Verneinung: 지 않는다"]
    ] },
    "b1-05n2": { mehr: "Quelle + 에 따르면, gleichbedeutend 에 의하면. Der Satz endet meist mit dem Weitersagen: -다고 한다, im Gespräch -대요. In Berichten über Zahlen steht oft -(으)ㄴ 것으로 나타났다 („es hat sich gezeigt, dass“). Im Gespräch sagt man einfacher: 뉴스에서 봤는데 … -대요.", verweis: "g-weitersagen", bsp: [
      ["뉴스[에 따르면] 내일 태풍이 온다고 한다.", "Laut den Nachrichten kommt morgen ein Taifun."],
      ["통계[에 따르면] 인구가 줄고 있다.", "Laut Statistik schrumpft die Bevölkerung."],
      ["일기예보[에 따르면] 주말에 비가 온다고 해요.", "Laut Wettervorhersage regnet es am Wochenende."],
      ["전문가[에 따르면] 걱정할 필요가 없다고 한다.", "Laut Fachleuten gibt es keinen Grund zur Sorge."],
      ["소문[에 의하면] 그 가게가 문을 닫는대요.", "Gerüchten zufolge sperrt das Geschäft zu.", "에 의하면 bedeutet dasselbe"],
      ["친구 말[에 따르면] 거기가 제일 싸대요.", "Nach dem, was mein Freund sagt, ist es dort am billigsten."]
    ] },
    "b1-05n3": { mehr: "Drei Wege zum Passiv. Erstens eigene Verben mit 이, 히, 리 oder 기: 보다 → 보이다, 닫다 → 닫히다, 팔다 → 팔리다, 끊다 → 끊기다. Zweitens höfliche Gegenwart ohne 요 + 지다: 만들다 → 만들어지다, 정하다 → 정해지다, 짓다 → 지어지다. Drittens bei Verben mit 하다: 하다 → 되다 (발표하다 → 발표되다, 취소하다 → 취소되다). Wer es getan hat, steht – wenn überhaupt – mit 에게 oder 에 의해. Koreanisch verwendet das Passiv seltener als Deutsch; in Nachrichten ist es häufig.", bsp: [
      ["이 건물은 오래전에 [지어졌어요].", "Dieses Gebäude wurde vor langer Zeit gebaut.", "짓다 → 지어지다"],
      ["날짜가 [정해졌어요].", "Der Termin steht fest.", "정하다 → 정해지다"],
      ["회의가 [연기됐어요].", "Die Besprechung wurde verschoben.", "연기하다 → 연기되다"],
      ["이 책은 요즘 많이 [팔려요].", "Dieses Buch verkauft sich zurzeit gut.", "팔다 → 팔리다"],
      ["전화가 갑자기 [끊겼어요].", "Das Gespräch ist plötzlich abgebrochen.", "끊다 → 끊기다"],
      ["널리 [알려진] 이야기예요.", "Das ist eine weithin bekannte Geschichte.", "알리다 → 알려지다"]
    ] },
    "b1-05n4": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 것으로 보인다, nach Konsonant 을 것으로 보인다. Wörtlich: „es sieht danach aus, dass“. Ähnliche Formeln: -(으)ㄹ 전망이다 (die Aussicht ist), -(으)ㄹ 것으로 예상된다 (es wird erwartet). Ohne Zukunft, -(으)ㄴ / -는 것으로 보인다, heißt es „scheint“. Im Gespräch sagt man dafür -(으)ㄹ 것 같아요.", bsp: [
      ["물가는 당분간 더 [오를 것으로 보인다].", "Die Preise werden vorerst wohl weiter steigen."],
      ["비는 밤까지 [계속될 것으로 보인다].", "Der Regen wird voraussichtlich bis in die Nacht anhalten."],
      ["피해가 더 [늘어날 것으로 보입니다].", "Der Schaden wird voraussichtlich noch größer."],
      ["내년에는 경제가 [좋아질 전망이다].", "Für nächstes Jahr wird eine Erholung der Wirtschaft erwartet.", "전망 = Aussicht"],
      ["관광객이 크게 [늘 것으로 예상된다].", "Es wird erwartet, dass die Zahl der Touristen stark steigt.", "예상되다 = erwartet werden"],
      ["사고 원인은 운전자의 [실수인 것으로 보인다].", "Unfallursache scheint ein Fehler des Fahrers zu sein.", "ohne Zukunft: scheint"]
    ] },

    // ---------- b1-06 Gesellschaft ----------
    "b1-06n1": { kv: true, mehr: "Nomen + 로 인해서 nach Vokal und nach ㄹ, 으로 인해서 nach den übrigen Konsonanten. 서 fällt oft weg; geschrieben auch 인하여. Vor einem Nomen: (으)로 인한 (사고로 인한 피해 = der Schaden durch den Unfall). Die Form ist sachlich und steht in Nachrichten, Durchsagen und Aushängen. Im Gespräch sagt man 때문에.", bsp: [
      ["폭우[로 인해] 도로가 막혔습니다.", "Wegen des Starkregens ist die Straße gesperrt.", "우 endet auf Vokal → 로"],
      ["공사[로 인해] 불편을 드려 죄송합니다.", "Wir entschuldigen uns für die Unannehmlichkeiten durch die Bauarbeiten.", "typischer Aushang"],
      ["눈[으로 인해] 기차가 지연되고 있습니다.", "Wegen des Schnees haben die Züge Verspätung.", "눈 hat unten ㄴ → 으로"],
      ["스트레스[로 인해] 잠을 못 자요.", "Wegen des Stresses kann ich nicht schlafen."],
      ["사고[로 인한] 피해가 커요.", "Der Schaden durch den Unfall ist groß.", "vor dem Nomen: 로 인한"],
      ["감기[로 인해] 결석했어요.", "Wegen einer Erkältung habe ich gefehlt."]
    ] },
    "b1-06n2": { mehr: "Verb: Stamm + 기 위해서. Nomen: 을/를 위해서. 서 kann wegfallen; geschrieben auch 위하여. Vor einem Nomen: 을/를 위한 (아이를 위한 책 = ein Buch für Kinder). Die Form ist sachlicher als -(으)려고 und passt auch vor eine Aufforderung. Beim Anstoßen sagt man kurz: 위하여!", bsp: [
      ["시험에 [합격하기 위해서] 열심히 공부해요.", "Um die Prüfung zu bestehen, lerne ich fleißig."],
      ["돈을 [모으기 위해] 아르바이트를 해요.", "Um Geld zu sparen, habe ich einen Nebenjob."],
      ["아이[를 위해서] 일찍 퇴근해요.", "Für das Kind mache ich früh Feierabend."],
      ["미래[를 위해] 저축하고 있어요.", "Ich spare für die Zukunft."],
      ["아이[를 위한] 책이에요.", "Das ist ein Buch für Kinder.", "vor dem Nomen: 를 위한"],
      ["더 잘 [이해하기 위해] 다시 읽었어요.", "Um es besser zu verstehen, habe ich es noch einmal gelesen."]
    ] },
    "b1-06n3": { mehr: "Nomen + 을/를 통해서; 서 kann wegfallen. Es nennt den Weg, auf dem etwas geschieht: eine Person, die vermittelt, ein Medium, eine Erfahrung. Auch räumlich: durch etwas hindurch (창문을 통해). Vor einem Nomen: 을/를 통한.", bsp: [
      ["뉴스[를 통해] 알았어요.", "Ich habe es aus den Nachrichten erfahren."],
      ["앱[을 통해서] 주문할 수 있어요.", "Man kann über die App bestellen."],
      ["여행[을 통해] 많은 것을 배웠어요.", "Durch das Reisen habe ich viel gelernt."],
      ["아내[를 통해서] 한국 문화를 알게 됐어요.", "Durch meine Frau habe ich die koreanische Kultur kennengelernt."],
      ["창문[을 통해] 바다가 보여요.", "Durch das Fenster sieht man das Meer.", "auch räumlich: durch … hindurch"],
      ["이 기회[를 통해] 감사드리고 싶습니다.", "Bei dieser Gelegenheit möchte ich mich bedanken."]
    ] },
    "b1-06n4": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ수록, nach Konsonant 을수록. Stämme auf ㄹ bleiben (살수록). 듣다 → 들을수록. Verstärkt wiederholt man das Wort mit -(으)면: 보면 볼수록. Nomen: 일수록. 갈수록 ist ein fester Ausdruck: „mit der Zeit immer mehr“.", verweis: "g-anschluss", bsp: [
      ["[들을수록] 좋은 노래예요.", "Je öfter man das Lied hört, desto besser gefällt es.", "듣다 → 들을수록"],
      ["돈은 [많을수록] 좋아요.", "Je mehr Geld, desto besser.", "많 → 을수록"],
      ["[먹으면 먹을수록] 더 먹고 싶어요.", "Je mehr ich esse, desto mehr will ich.", "verstärkt mit 면"],
      ["[생각할수록] 화가 나요.", "Je länger ich darüber nachdenke, desto mehr ärgere ich mich."],
      ["[갈수록] 어려워져요.", "Es wird immer schwieriger.", "갈수록 = mit der Zeit immer mehr"],
      ["[바쁠수록] 건강을 챙겨야 해요.", "Je mehr man zu tun hat, desto mehr muss man auf die Gesundheit achten."]
    ] },

    // ---------- b1-07 Arbeit ----------
    "b1-07n1": { mehr: "Stamm + 도록. Drei Verwendungen. Zweck: „damit“ – die beiden Teile dürfen verschiedene Personen haben (아이가 깨지 않도록). Grenze: „bis“ (밤늦도록 = bis spät in die Nacht). Mit 하다: -도록 하다 = dafür sorgen, dass. Sehr häufig mit Verneinung (-지 않도록) und mit 수 있다 (-(으)ㄹ 수 있도록).", bsp: [
      ["감기에 [걸리지 않도록] 조심하세요.", "Passen Sie auf, dass Sie sich nicht erkälten."],
      ["잘 [들리도록] 크게 말해 주세요.", "Sprechen Sie bitte laut, damit man es gut hört."],
      ["아이들이 [먹을 수 있도록] 작게 잘랐어요.", "Ich habe es klein geschnitten, damit die Kinder es essen können."],
      ["[이해할 수 있도록] 쉽게 설명해 주세요.", "Erklären Sie es bitte einfach, damit ich es verstehen kann."],
      ["밤[늦도록] 일했어요.", "Ich habe bis spät in die Nacht gearbeitet.", "auch: bis zu einem Punkt"],
      ["다음부터 [늦지 않도록 하세요].", "Achten Sie darauf, das nächste Mal nicht zu spät zu kommen.", "도록 하다 = dafür sorgen"]
    ] },
    "b1-07n2": { mehr: "Stamm + 게 하다: jemanden etwas tun lassen – veranlassen oder erlauben. Die Person steht mit 을/를 oder 한테. 못 -게 하다 = nicht erlauben. -게 해 주세요 = „lassen Sie mich“. 시키다 mit einem Nomen: jemandem etwas auftragen (일을 시키다); außerdem heißt es „bestellen“ (피자를 시키다). Einige Verben haben eine eigene Form: 먹이다 (zu essen geben), 입히다 (anziehen), 재우다 (schlafen legen), 깨우다 (wecken), 태우다 (mitnehmen).", bsp: [
      ["아이를 일찍 [자게 해요].", "Ich lasse das Kind früh schlafen gehen."],
      ["저도 [가게 해 주세요].", "Lassen Sie mich auch mitgehen."],
      ["엄마가 게임을 못 [하게 해요].", "Mama erlaubt keine Spiele.", "못 … 게 하다 = nicht erlauben"],
      ["그 영화가 저를 [울게 했어요].", "Der Film hat mich zum Weinen gebracht."],
      ["아이한테 심부름을 [시켰어요].", "Ich habe das Kind etwas besorgen lassen."],
      ["저녁은 치킨을 [시킬까요]?", "Sollen wir zum Abendessen Hendl bestellen?", "시키다 heißt auch: bestellen"]
    ] },
    "b1-07n3": { mehr: "Nomen + 덕분에. Verb: Stamm + ㄴ 덕분에, nach Konsonant 은 덕분에; oft mit -아/어 주다 (도와준 덕분에). Am Satzende: 덕분이에요. Es nennt einen Grund, über den man froh ist. Für störende Gründe nimmt man 때문에. Auf die Frage nach dem Befinden antwortet man gern: 덕분에 잘 지내요.", bsp: [
      ["부모님 [덕분에] 여기까지 왔어요.", "Dank meiner Eltern bin ich so weit gekommen."],
      ["날씨가 [좋은 덕분에] 잘 다녀왔어요.", "Dank des schönen Wetters war der Ausflug gut."],
      ["일찍 [출발한 덕분에] 안 늦었어요.", "Weil wir früh losgefahren sind, waren wir pünktlich."],
      ["걱정해 주신 [덕분에] 많이 나았어요.", "Dank Ihrer Anteilnahme geht es mir viel besser."],
      ["다 선생님 [덕분이에요].", "Das verdanke ich alles Ihnen."],
      ["이 앱 [덕분에] 매일 공부해요.", "Dank dieser App lerne ich jeden Tag."]
    ] },
    "b1-07n4": { mehr: "Zwei Bedeutungen. Sobald: Verbstamm + 는 대로, für etwas, das noch kommt (도착하는 대로). So wie: 는 대로 für das, was gerade ist oder getan wird (하는 대로), -(으)ㄴ 대로 für das, was war (들은 대로, 본 대로). Hinter einem Nomen ohne Leerzeichen: 약속대로 (wie versprochen), 계획대로 (nach Plan), 마음대로 (nach Belieben), 그대로 (so wie es ist).", bsp: [
      ["일이 [끝나는 대로] 갈게요.", "Ich komme, sobald die Arbeit fertig ist."],
      ["결과가 [나오는 대로] 알려 드릴게요.", "Ich sage Ihnen Bescheid, sobald das Ergebnis da ist."],
      ["[들은 대로] 얘기해 주세요.", "Erzählen Sie es so, wie Sie es gehört haben.", "Vergangenheit → ㄴ 대로: so wie"],
      ["제가 [하는 대로] 따라 하세요.", "Machen Sie es mir nach."],
      ["[계획대로] 잘 됐어요.", "Es ist nach Plan gelaufen.", "Nomen + 대로"],
      ["[마음대로] 하세요.", "Machen Sie es, wie Sie wollen."]
    ] },

    // ---------- b1-08 Bewerbung ----------
    "b1-08n1": { mehr: "Stamm + 고자 합니다. Es bedeutet dasselbe wie -(으)려고 합니다, klingt aber förmlich und passt zu Bewerbung, Ansprache, Vortrag und Schreiben. Nur für die eigene Absicht. Mitten im Satz heißt -고자 „um zu“.", bsp: [
      ["오늘은 이 문제에 대해 [말씀드리고자 합니다].", "Heute möchte ich über dieses Problem sprechen."],
      ["여러분의 의견을 [듣고자 합니다].", "Ich möchte Ihre Meinung hören."],
      ["새로운 일에 [도전하고자 합니다].", "Ich möchte mich an eine neue Aufgabe wagen."],
      ["몇 가지 [여쭤보고자 합니다].", "Ich möchte Sie einiges fragen.", "여쭤보다 = fragen (bescheiden)"],
      ["경험을 [쌓고자] 지원했습니다.", "Ich habe mich beworben, um Erfahrung zu sammeln.", "mitten im Satz: um zu"],
      ["감사의 말씀을 [드리고자 합니다].", "Ich möchte meinen Dank aussprechen."]
    ] },
    "b1-08n2": { kv: "stamm", mehr: "Verb, jetzt: Stamm + 는 만큼. Verb, vorbei, und Eigenschaftswort: Stamm + ㄴ 만큼, nach Konsonant 은 만큼. Mit -(으)ㄹ 만큼: „so sehr, dass“. Hinter einem Nomen: Nomen + 만큼 („so … wie“). Zwei Bedeutungen: ein Maß (먹고 싶은 만큼 = so viel du willst) und eine Entsprechung, die fast ein Grund ist (비싼 만큼 좋아요 = teuer, entsprechend gut).", verweis: "g-vornomen", bsp: [
      ["[일한 만큼] 받아요.", "Man bekommt so viel, wie man gearbeitet hat.", "Verb, vorbei → ㄴ 만큼"],
      ["[필요한 만큼]만 가져가세요.", "Nehmen Sie nur so viel, wie Sie brauchen."],
      ["[비싼 만큼] 품질이 좋아요.", "Es ist teuer, entsprechend gut ist die Qualität."],
      ["아이가 [저만큼] 컸어요.", "Das Kind ist so groß wie ich geworden.", "Nomen + 만큼"],
      ["[놀랄 만큼] 빨리 배워요.", "Er lernt erstaunlich schnell.", "ㄹ 만큼 = so sehr, dass"],
      ["[아는 만큼] 보여요.", "Man sieht so viel, wie man weiß.", "알다 → 아는"]
    ] },
    "b1-08n3": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 오다 (일해요 → 일해 오다). Etwas hat in der Vergangenheit begonnen und reicht bis jetzt. Oft mit 지금까지, 그동안, … 동안, …부터. Vor einem Nomen: -아/어 온. Das Gegenstück ist -아/어 가다: von jetzt an weiter (다 되어 가요 = es wird bald fertig).", verweis: "g-anschluss", bsp: [
      ["이 회사에서 오 년 동안 [일해 왔어요].", "Ich arbeite seit fünf Jahren in dieser Firma."],
      ["지금까지 잘 [참아 왔어요].", "Bis jetzt habe ich es gut ausgehalten."],
      ["어릴 때부터 피아노를 [배워 왔어요].", "Ich lerne seit der Kindheit Klavier."],
      ["그동안 많이 [도와 왔습니다].", "Ich habe die ganze Zeit über viel geholfen."],
      ["계속 [고민해 온] 문제예요.", "Das ist ein Problem, über das ich schon lange nachdenke.", "vor dem Nomen: 온"],
      ["일이 거의 다 [되어 가요].", "Die Arbeit ist bald fertig.", "가다: von jetzt an weiter"]
    ] },
    "b1-08n4": { kv: "stamm", mehr: "Bildung: Stamm + ㅁ nach Vokal (하다 → 함, 가다 → 감), 음 nach Konsonant (있다 → 있음, 없다 → 없음). Stämme auf ㄹ: 만들다 → 만듦. Vergangenheit: -았음 / -었음. So schreibt man Notizen, Protokolle, Aushänge und Formulare: knapp, ohne Sprechstufe. Auf Formularen häufig: 해당 없음 (trifft nicht zu). Dieselbe Endung bildet gewöhnliche Nomen: 도움 (Hilfe), 믿음 (Vertrauen), 웃음 (Lachen), 느낌 (Gefühl), 모임 (Treffen), 꿈 (Traum), 잠 (Schlaf).", bsp: [
      ["오늘 회의 [없음].", "Heute keine Besprechung.", "없다 → 없음"],
      ["운전 [가능함].", "Führerschein vorhanden.", "wörtlich: Fahren möglich"],
      ["내일까지 [제출함].", "Abgabe bis morgen.", "제출하다 → 제출함"],
      ["문 [닫았음].", "Geschlossen.", "Vergangenheit → 닫았음"],
      ["확인 [바람].", "Bitte um Bestätigung.", "바라다 → 바람"],
      ["[도움]이 필요해요.", "Ich brauche Hilfe.", "돕다 → 도움: ein eigenes Nomen"]
    ] },

    // ---------- b1-09 Wohnung suchen ----------
    "b1-09n1": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 경우에, nach Konsonant 을 경우에. Für Abgeschlossenes: -았을 경우에. 경우 heißt „Fall“. Die Form ist sachlicher als -(으)면 und steht in Verträgen, Gebrauchsanweisungen und Hinweisen. 에 kann wegfallen; mit 는 betont man: 경우에는. Hinter einem Nomen: Nomen + 의 경우.", verweis: "g-vornomen", bsp: [
      ["비가 [올 경우에는] 실내에서 합니다.", "Bei Regen findet es drinnen statt."],
      ["[필요할 경우] 연락 주세요.", "Melden Sie sich, falls nötig."],
      ["[분실했을 경우] 바로 신고하세요.", "Bei Verlust melden Sie es bitte sofort.", "abgeschlossen → 했을 경우"],
      ["환불을 [원할 경우] 영수증이 필요해요.", "Wer das Geld zurück möchte, braucht den Beleg."],
      ["[저의 경우에는] 괜찮았어요.", "In meinem Fall war es in Ordnung.", "Nomen + 의 경우"],
      ["[그럴 경우에는] 어떻게 해요?", "Was macht man in dem Fall?"]
    ] },
    "b1-09n2": { mehr: "Nomen + 에 따라서; 서 kann wegfallen. Zwei Bedeutungen: „je nach“ – meist mit 다르다 oder 달라지다 – und „gemäß“ (규칙에 따라). 에 따라서는 heißt „je nach … kann es sein, dass“. Nicht verwechseln mit 에 따르면 (laut, zufolge).", bsp: [
      ["날씨[에 따라] 일정이 바뀔 수 있어요.", "Je nach Wetter kann sich der Zeitplan ändern."],
      ["나이[에 따라] 요금이 달라요.", "Der Preis hängt vom Alter ab."],
      ["계절[에 따라] 메뉴가 달라져요.", "Die Speisekarte wechselt mit der Jahreszeit."],
      ["규칙[에 따라] 처리하겠습니다.", "Wir gehen nach den Regeln vor.", "auch: gemäß"],
      ["경우[에 따라서는] 더 걸릴 수도 있어요.", "Je nach Fall kann es auch länger dauern."],
      ["지역[에 따라] 말이 조금 달라요.", "Je nach Gegend spricht man etwas anders."]
    ] },
    "b1-09n3": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 수도 있어요, nach Konsonant 을 수도 있어요. Es ist -(으)ㄹ 수 있어요 mit 도 (auch): nicht „können“ im Sinn einer Fähigkeit, sondern „es ist auch möglich, dass“. Für Vergangenes: -았을 수도 있어요. Verneint: 안 -(으)ㄹ 수도 있어요. 그럴 수도 있죠 sagt man tröstend: Das kann vorkommen.", bsp: [
      ["내일은 못 [갈 수도 있어요].", "Morgen kann ich vielleicht nicht kommen."],
      ["생각보다 [비쌀 수도 있어요].", "Es könnte teurer sein als gedacht."],
      ["제가 [틀렸을 수도 있어요].", "Vielleicht habe ich mich geirrt.", "Vergangenes: 틀렸을 수도"],
      ["표가 [없을 수도 있어요].", "Es könnte sein, dass es keine Karten gibt.", "없 → 을 수도"],
      ["[그럴 수도 있죠].", "Das kann schon vorkommen.", "tröstend"],
      ["비가 안 [올 수도 있어요].", "Es könnte auch sein, dass es nicht regnet."]
    ] },
    "b1-09n4": { mehr: "-기로 하다 heißt „beschließen, ausmachen“. Mit 되어 있다 wird daraus ein Zustand: Es ist so geregelt. 되어 wird im Gespräch zu 돼. In der Vergangenheit, -기로 되어 있었어요, war etwas vorgesehen – und ist oft anders gekommen. Hinter einem Nomen heißt (으)로 되어 있다 „besteht aus, ist angelegt als“.", bsp: [
      ["내일 아침에 [만나기로 되어 있어요].", "Wir sind für morgen früh verabredet."],
      ["회의는 세 시에 [시작하기로 되어 있어요].", "Die Besprechung ist für drei Uhr angesetzt."],
      ["비용은 회사에서 [내기로 돼 있어요].", "Die Kosten trägt laut Regelung die Firma.", "되어 → 돼"],
      ["원래 오늘 [도착하기로 되어 있었어요].", "Eigentlich hätte es heute ankommen sollen.", "Vergangenheit: war so vorgesehen"],
      ["신발을 벗고 [들어가기로 되어 있어요].", "Man zieht die Schuhe aus, bevor man hineingeht – so ist es vorgeschrieben."],
      ["이 건물은 오 층[으로 되어 있어요].", "Dieses Gebäude hat fünf Stockwerke.", "Nomen + 으로 되어 있다 = besteht aus"]
    ] },

    // ---------- b1-10 Einzug, Reparaturen, Ärger ----------
    "b1-10n1": { mehr: "Stamm + 지 않으면 안 돼요: „wenn nicht …, geht es nicht“. Es bedeutet dasselbe wie -아야 해요, klingt aber dringender. Kurze Form: 안 -(으)면 안 돼요. Bei einem Nomen: 이/가 아니면 안 돼요 („es muss … sein“). Förmlich: 안 됩니다.", bsp: [
      ["오늘 [끝내지 않으면 안 돼요].", "Das muss heute fertig werden."],
      ["약을 [먹지 않으면 안 돼요].", "Ich muss das Medikament unbedingt nehmen."],
      ["[예약하지 않으면 안 돼요]?", "Muss man unbedingt reservieren?"],
      ["지금 [안 가면 안 돼요].", "Ich muss jetzt wirklich gehen.", "kurze Form"],
      ["꼭 [오늘이 아니면 안 돼요]?", "Muss es unbedingt heute sein?", "Nomen: 이 아니면 안 돼요"],
      ["[조심하지 않으면 안 됩니다].", "Man muss unbedingt aufpassen.", "förmlich"]
    ] },
    "b1-10n2": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 야 (가요 → 가야, 있어요 → 있어야, 해요 → 해야). Nomen: 이어야 / 여야. Der erste Teil nennt die Bedingung, ohne die das Zweite nicht geht: „nur wenn“, „erst wenn“. 만 verstärkt: -아야만. Dieselbe Form steckt in -아야 해요 und -아야 돼요 („muss“ – wörtlich: nur wenn …, geht es).", verweis: "g-anschluss", bsp: [
      ["일찍 [가야] 자리가 있어요.", "Nur wenn man früh hingeht, gibt es einen Platz."],
      ["직접 [봐야] 알 수 있어요.", "Das weiß man erst, wenn man es selbst sieht."],
      ["[회원이어야] 들어갈 수 있어요.", "Hinein darf man nur als Mitglied.", "Nomen: 이어야"],
      ["많이 [연습해야] 늘어요.", "Besser wird man nur, wenn man viel übt."],
      ["열심히 [해야만] 성공할 수 있어요.", "Nur wer sich wirklich bemüht, kann Erfolg haben.", "만 verstärkt"],
      ["돈이 [있어야] 살 수 있어요.", "Kaufen kann man es nur, wenn man Geld hat."]
    ] },
    "b1-10n3": { mehr: "Verbstamm + 는 바람에; bei Stämmen auf ㄹ fällt das ㄹ weg (울다 → 우는 바람에). Auch wenn alles vorbei ist, steht vorn die Gegenwartsform. Im zweiten Teil steht immer etwas Unerwünschtes in der Vergangenheit. Der Grund kam unerwartet und lag nicht in der eigenen Hand. Nach -는 바람에 folgt keine Bitte und kein Vorschlag.", bsp: [
      ["차가 [막히는 바람에] 비행기를 놓쳤어요.", "Wegen des Staus habe ich den Flug verpasst."],
      ["갑자기 비가 [오는 바람에] 다 젖었어요.", "Weil es plötzlich geregnet hat, bin ich ganz nass geworden."],
      ["휴대폰이 [꺼지는 바람에] 연락을 못 했어요.", "Das Handy ist ausgegangen, deshalb konnte ich mich nicht melden."],
      ["아이가 [우는 바람에] 잠을 못 잤어요.", "Weil das Kind geweint hat, konnte ich nicht schlafen.", "울다: ㄹ fällt weg → 우는"],
      ["급하게 [나오는 바람에] 지갑을 두고 왔어요.", "Ich bin in Eile aus dem Haus und habe die Geldbörse liegen lassen."],
      ["[넘어지는 바람에] 다리를 다쳤어요.", "Ich bin gestürzt und habe mir das Bein verletzt."]
    ] },
    "b1-10n4": { kv: "stamm", mehr: "Verb, jetzt: Stamm + 는 데다가. Verb, vorbei, und Eigenschaftswort: Stamm + ㄴ 데다가, nach Konsonant 은 데다가. 가 kann wegfallen. Beide Teile zeigen in dieselbe Richtung: zwei Vorzüge oder zwei Ärgernisse. Im zweiten Teil steht meist 도 oder 까지. Hinter einem Nomen heißt 에다가 „dazu, obendrauf“.", verweis: "g-vornomen", bsp: [
      ["값이 [싼 데다가] 맛도 좋아요.", "Es ist billig und schmeckt noch dazu gut."],
      ["일이 [많은 데다가] 사람도 부족해요.", "Es gibt viel Arbeit, und noch dazu fehlen Leute.", "많 → 은 데다가"],
      ["감기에 [걸린 데다가] 잠도 못 잤어요.", "Ich bin erkältet und habe noch dazu nicht geschlafen.", "Verb, vorbei → ㄴ 데다가"],
      ["그 사람은 일을 [잘하는 데다가] 성격도 좋아요.", "Er arbeitet gut und ist noch dazu umgänglich.", "Verb, jetzt → 는 데다가"],
      ["길이 [막히는 데다] 비까지 와요.", "Es staut, und noch dazu regnet es.", "ohne 가"],
      ["밥[에다가] 계란을 넣어요.", "Ich gebe ein Ei zum Reis.", "Nomen + 에다가 = dazu"]
    ] },

    // ---------- b1-11 Gesundheit: Gewohnheiten ----------
    "b1-11n1": { mehr: "Stamm + 곤 하다 (kurz für -고는 하다). In der Gegenwart: Man tut etwas immer wieder einmal – nicht ständig, aber regelmäßig genug, um es zu erwähnen. In der Vergangenheit, -곤 했어요: Früher hat man es öfter getan, heute nicht mehr. Für Dinge, die man immer oder täglich tut, passt es nicht.", bsp: [
      ["시간이 나면 영화를 [보곤 해요].", "Wenn ich Zeit habe, schaue ich gern einmal einen Film."],
      ["가끔 혼자 [여행하곤 해요].", "Manchmal verreise ich allein."],
      ["피곤하면 [낮잠을 자곤 해요].", "Wenn ich müde bin, mache ich öfter einen Mittagsschlaf."],
      ["예전에는 자주 [만나곤 했어요].", "Früher haben wir uns oft getroffen.", "Vergangenheit: früher öfter"],
      ["어릴 때 여기에서 [놀곤 했어요].", "Als Kind habe ich hier oft gespielt."],
      ["잠이 안 오면 책을 [읽곤 해요].", "Wenn ich nicht einschlafen kann, lese ich meistens."]
    ] },
    "b1-11n2": { mehr: "Verb: Stamm + 는 대신에. Nomen: Nomen + 대신에. 에 kann wegfallen. Zwei Bedeutungen. Ersatz: Man tut das eine anstelle des anderen. Ausgleich: Etwas hat einen Nachteil, dafür einen Vorteil – dann auch mit Eigenschaftswort, -(으)ㄴ 대신에 (싼 대신에 멀어요). 대신 allein heißt „stattdessen“.", bsp: [
      ["택시를 [타는 대신] 걸어갔어요.", "Statt ein Taxi zu nehmen, bin ich zu Fuß gegangen."],
      ["밥 [대신] 빵을 먹었어요.", "Statt Reis habe ich Brot gegessen.", "Nomen + 대신"],
      ["제가 [가는 대신에] 동생이 갈 거예요.", "Statt mir geht mein jüngerer Bruder."],
      ["값이 [싼 대신에] 좀 멀어요.", "Es ist günstig, dafür etwas weit.", "auch: dafür, als Ausgleich"],
      ["오늘 [쉬는 대신] 주말에 일해요.", "Ich habe heute frei und arbeite dafür am Wochenende."],
      ["저 [대신] 가 주실 수 있어요?", "Könnten Sie an meiner Stelle hingehen?"]
    ] },
    "b1-11n3": { mehr: "Verbstamm + 는 데, mit Leerzeichen vor 데; 에 kann dazukommen. 데 heißt hier „bei der Sache, für den Zweck“. Dahinter stehen Ausdrücke wie 좋다 (gut), 도움이 되다 (helfen), 필요하다 (nötig sein), 시간이 걸리다 (Zeit brauchen), 돈이 들다 (Geld kosten). Nicht verwechseln mit -는데 ohne Leerzeichen (und, aber).", bsp: [
      ["감기가 [낫는 데] 좋아요.", "Das ist gut, um eine Erkältung loszuwerden."],
      ["한국어를 [배우는 데] 도움이 됐어요.", "Das hat beim Koreanischlernen geholfen."],
      ["집을 [구하는 데] 시간이 많이 걸렸어요.", "Die Wohnungssuche hat lange gedauert.", "wofür Zeit nötig ist"],
      ["여기까지 [오는 데] 한 시간 걸렸어요.", "Bis hierher habe ich eine Stunde gebraucht."],
      ["아이를 [키우는 데] 돈이 많이 들어요.", "Ein Kind großzuziehen kostet viel Geld."],
      ["스트레스를 [푸는 데에는] 운동이 최고예요.", "Gegen Stress ist Sport das Beste.", "mit 에는"]
    ] },
    "b1-11n4": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 야겠어요 (가요 → 가야겠어요, 먹어요 → 먹어야겠어요, 해요 → 해야겠어요). Es verbindet „müssen“ (-아야 하다) mit dem 겠 der Absicht: Man merkt gerade, dass etwas nötig ist, und nimmt es sich vor. Über andere gesagt, mit -(으)시-, ist es ein Rat (쉬셔야겠어요). Zu sich selbst: -아야겠다.", verweis: "g-anschluss", bsp: [
      ["이제 [가야겠어요].", "Ich sollte jetzt gehen."],
      ["약을 [먹어야겠어요].", "Ich sollte wohl ein Medikament nehmen."],
      ["내일은 일찍 [일어나야겠어요].", "Morgen sollte ich früh aufstehen."],
      ["좀 [쉬셔야겠어요].", "Sie sollten sich etwas ausruhen.", "an andere: ein Rat"],
      ["방 좀 [치워야겠다].", "Ich sollte das Zimmer aufräumen.", "zu sich selbst"],
      ["한국어 공부를 더 [해야겠어요].", "Ich sollte mehr Koreanisch lernen."]
    ] },

    // ---------- b1-12 Bereuen und sich vornehmen ----------
    "b1-12n1": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ걸 그랬어요, nach Konsonant 을걸 그랬어요. 걸 ist kurz für 것을. Man bedauert, etwas nicht getan zu haben. Verneint – man bedauert, etwas getan zu haben: -지 말걸 그랬어요. Zu sich selbst reicht -(으)ㄹ걸. Achtung: -(으)ㄹ걸요 mit 요 und steigender Stimme ist eine Vermutung („wohl“).", bsp: [
      ["조금 더 [기다릴걸 그랬어요].", "Hätte ich doch noch etwas gewartet."],
      ["사진을 [찍을걸 그랬어요].", "Hätte ich doch ein Foto gemacht.", "찍 → 을걸"],
      ["아침을 [먹고 올걸].", "Hätte ich doch gefrühstückt.", "kurz, zu sich selbst"],
      ["그 말은 [하지 말걸 그랬어요].", "Hätte ich das doch nicht gesagt.", "verneint: 지 말걸"],
      ["택시를 [탈걸 그랬어요].", "Hätte ich doch ein Taxi genommen."],
      ["아마 내일 [올걸요].", "Er kommt wohl morgen.", "mit 요 und steigender Stimme: Vermutung"]
    ] },
    "b1-12n2": { mehr: "Aufbau: Vergangenheit + 어야 했어요 (가다 → 갔어야 했어요, 하다 → 했어야 했어요). Etwas wäre nötig gewesen und ist nicht geschehen. Mit -는데 am Ende bleibt der Satz offen und klingt bedauernd. Verneint: -지 말았어야 했는데 („hätte nicht sollen“). An andere gerichtet, -았어야죠, ist es ein Vorwurf.", bsp: [
      ["우산을 [가져왔어야 했는데].", "Ich hätte einen Schirm mitnehmen sollen."],
      ["미리 [말했어야 했어요].", "Ich hätte es vorher sagen sollen."],
      ["조금 더 [참았어야 했는데] 화를 냈어요.", "Ich hätte mich noch beherrschen sollen, bin aber wütend geworden."],
      ["그때 [가지 말았어야 했어요].", "Ich hätte damals nicht hingehen sollen.", "verneint: 지 말았어야"],
      ["더 일찍 [왔어야죠].", "Sie hätten früher kommen sollen.", "an andere: ein Vorwurf"],
      ["표를 미리 [샀어야 했는데] 매진됐어요.", "Ich hätte die Karten vorher kaufen sollen, jetzt sind sie ausverkauft."]
    ] },
    "b1-12n3": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 수밖에 없어요, nach Konsonant 을 수밖에 없어요. Aufbau: 수 (Möglichkeit) + 밖에 (außer) + 없어요: „außer … gibt es keine Möglichkeit“. Bei Handlungen: Es bleibt nichts anderes übrig. Bei Eigenschaften: Es kann gar nicht anders sein (비쌀 수밖에 없어요 = kein Wunder, dass es teuer ist).", bsp: [
      ["혼자 [할 수밖에 없어요].", "Ich muss es wohl allein machen."],
      ["버스가 끊겨서 [걸어갈 수밖에 없었어요].", "Es fuhr kein Bus mehr, ich musste zu Fuß gehen."],
      ["그렇게 [말할 수밖에 없었어요].", "Ich konnte gar nichts anderes sagen."],
      ["재료가 좋으니까 [맛있을 수밖에 없어요].", "Bei so guten Zutaten muss es ja schmecken.", "bei Eigenschaften: kein Wunder, dass"],
      ["이번에는 [포기할 수밖에 없어요].", "Diesmal bleibt nur aufzugeben."],
      ["[믿을 수밖에 없어요].", "Man kann es nur glauben."]
    ] },
    "b1-12n4": { mehr: "Stamm + 도록 할게요, förmlich 도록 하겠습니다. Man verspricht, sich um etwas zu bemühen – etwas vorsichtiger als ein glattes -(으)ㄹ게요. Sehr häufig mit Verneinung: -지 않도록 하겠습니다. In der Aufforderung, -도록 하세요, ist es eine höfliche Anweisung, wie man sie von Ärzten und Vorgesetzten hört.", bsp: [
      ["내일까지 [보내도록 할게요].", "Ich schaue, dass ich es bis morgen schicke."],
      ["다음부터는 미리 [말씀드리도록 하겠습니다].", "Künftig werde ich es Ihnen vorher sagen."],
      ["[실수하지 않도록 하겠습니다].", "Ich werde darauf achten, keinen Fehler zu machen."],
      ["약은 식후에 [드시도록 하세요].", "Nehmen Sie das Medikament bitte nach dem Essen.", "도록 하세요: höfliche Anweisung"],
      ["오늘은 일찍 [자도록 해요].", "Schauen wir, dass wir heute früh schlafen gehen."],
      ["꼭 [참석하도록 할게요].", "Ich werde auf jeden Fall versuchen, dabei zu sein."]
    ] }
  }
});
