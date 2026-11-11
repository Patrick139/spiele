// grammatik_a2_2.js — Grammatikteil zu A2, Teil 2 (Lektionen a2-13 … a2-24): zwei Übersichtsseiten und zu jeder Regel
// eine genauere Erklärung mit Beispielen. Aufbau und Regeln wie in grammatik.js: Beispiele nur ANS ENDE anhängen,
// nichts umreihen, nichts löschen (stilllegen mit null). Kennung eines Beispiels = Schlüssel + "b" + Platz.
// kv: "stamm" = die Form hängt davon ab, ob der Verbstamm auf Konsonant oder Vokal endet.
KO.grammatik({
  grund: [
    { id: "g-ehrend", titel: "Ehrende Sprache im Überblick", kurz: "Wie man über Ältere und Fremde spricht: -(으)시-, eigene Verben, eigene Nomen, 께서 und 께.",
      text: [
        "Ehrende Sprache zeigt Respekt vor der Person, über die man spricht – meist ist das zugleich die Person, mit der man spricht. Sie kommt zur Sprechstufe (höflich, förmlich) dazu.",
        "Es gibt zwei Richtungen. Erstens: Man hebt die Person, die etwas tut (-(으)시-, eigene Verben wie 드시다, 께서). Zweitens: Man stellt sich selbst tiefer, wenn man für diese Person etwas tut (드리다, 뵙다, 께)."
      ],
      tabelle: [
        ["", "neutral", "ehrend"],
        ["Verb allgemein", "가요 · 읽어요", "가세요 · 읽으세요"],
        ["Vergangenheit", "갔어요", "가셨어요"],
        ["essen, trinken", "먹어요 · 마셔요", "드세요"],
        ["schlafen", "자요", "주무세요"],
        ["da sein", "있어요", "계세요"],
        ["sagen", "말해요", "말씀하세요"],
        ["geben (an Ältere)", "줘요", "드려요"],
        ["treffen, sehen (Ältere)", "만나요 · 봐요", "뵈어요 (봬요)"],
        ["wer (Subjekt)", "이 / 가", "께서"],
        ["an wen", "한테", "께"],
        ["Name · Alter", "이름 · 나이", "성함 · 연세"],
        ["Geburtstag · Zuhause", "생일 · 집", "생신 · 댁"],
        ["Worte · Mahlzeit", "말 · 밥", "말씀 · 진지"]
      ],
      danach: [
        "Über sich selbst verwendet man nie -(으)시- und nie die ehrenden Nomen. Auf 성함이 어떻게 되세요? antwortet man mit 제 이름은 …",
        "Über die eigene Frau oder den eigenen Mann spricht man gegenüber Fremden neutral, über die Schwiegereltern ehrend."
      ],
      bsp: [
        ["어머님, 뭐 [드시겠어요]?", "Mutter, was möchten Sie essen?", "먹다 → 드시다"],
        ["아버님은 지금 [주무세요].", "Der Vater schläft gerade.", "자다 → 주무시다"],
        ["할머니[께서] 집에 [계세요].", "Die Großmutter ist zu Hause.", "가 → 께서, 있다 → 계시다"],
        ["선생님[께] 선물을 [드렸어요].", "Ich habe der Lehrerin ein Geschenk gegeben.", "한테 → 께, 주다 → 드리다"],
        ["다음 주에 [뵙겠습니다].", "Wir sehen uns nächste Woche.", "만나다 → 뵙다"],
        ["[성함]이 어떻게 되세요?", "Wie ist Ihr Name?", "이름 → 성함"]
      ],
      siehe: ["g-stufen", "a1-16n1", "a2-13n1", "a2-21n1", "a2-21n2", "a2-21n3", "a2-18n3", "a2-16n4"] },

    { id: "g-weitersagen", titel: "Weitersagen im Überblick", kurz: "Wie man wiedergibt, was jemand gesagt, gefragt, verlangt oder vorgeschlagen hat – lang und in der gesprochenen Kurzform.",
      text: [
        "Im Deutschen sagt man „er sagt, dass …“. Im Koreanischen hängt man an den wiedergegebenen Satz eine Endung und setzt 해요 oder 했어요 dahinter. Welche Endung, hängt davon ab, ob es eine Aussage, eine Frage, eine Aufforderung oder ein Vorschlag war.",
        "Im Gespräch zieht man Endung und 해요 zu einer Kurzform zusammen. Diese Kurzformen hört man ständig."
      ],
      tabelle: [
        ["Was gesagt wurde", "lang", "kurz (gesprochen)"],
        ["Aussage, Verb", "온다고 해요 · 먹는다고 해요", "온대요 · 먹는대요"],
        ["Aussage, Eigenschaftswort", "바쁘다고 해요", "바쁘대요"],
        ["Aussage, Vergangenheit", "갔다고 해요", "갔대요"],
        ["Aussage, Nomen", "학생이라고 해요", "학생이래요"],
        ["Frage", "가냐고 해요", "가냬요"],
        ["Aufforderung", "가라고 해요 · 먹으라고 해요", "가래요 · 먹으래요"],
        ["Vorschlag", "가자고 해요", "가재요"]
      ],
      danach: [
        "Statt 해요 kann ein genaueres Verb stehen: 말했어요 (hat gesagt), 물었어요 (hat gefragt), 들었어요 (habe gehört), 생각해요 (denke).",
        "Wer es gesagt hat, steht mit 이/가 davor: 선생님이 … 했어요. Fehlt die Person, heißt es „man sagt, es heißt“.",
        "Die Kurzform -(으)래요 (soll) sieht fast aus wie -(으)ㄹ래요 (will). Der Unterschied ist das ㄹ unten: 가래요 = ich soll gehen. 갈래요 = ich will gehen."
      ],
      bsp: [
        ["내일 비가 [온대요].", "Morgen soll es regnen.", "kurz für 온다고 해요"],
        ["친구가 [바쁘다고 했어요].", "Mein Freund hat gesagt, er hat viel zu tun.", "Eigenschaftswort + 다고"],
        ["의사가 푹 [쉬라고 했어요].", "Der Arzt hat gesagt, ich soll mich ausruhen.", "Aufforderung + 라고"],
        ["아이가 어디 [가냐고 물어요].", "Das Kind fragt, wohin wir gehen.", "Frage + 냐고"],
        ["아내가 같이 [가자고 했어요].", "Meine Frau hat vorgeschlagen, zusammen zu gehen.", "Vorschlag + 자고"],
        ["저 사람이 [의사래요].", "Die Person dort ist Arzt, heißt es.", "Nomen, kurz für 의사라고 해요"]
      ],
      siehe: ["a2-22n1", "a2-22n2", "a2-23n1", "a2-23n2", "a2-23n3", "a2-23n4"] }
  ],

  regeln: {
    // ---------- a2-13 Im Büro ----------
    "a2-13n1": { kv: "stamm", mehr: "Bildung: Stamm + ㅂ니다 nach Vokal (가다 → 갑니다, 하다 → 합니다), Stamm + 습니다 nach Konsonant (먹다 → 먹습니다, 있다 → 있습니다). Bei Stämmen auf ㄹ fällt das ㄹ weg (살다 → 삽니다). Sein: 입니다, nicht sein: 아닙니다. Vergangenheit: -았습니다 / -었습니다. Ehrend: -(으)십니다. Die förmliche Aufforderung heißt -(으)십시오 (기다려 주십시오). Die Bedeutung ist dieselbe wie bei -아요/어요; der Unterschied liegt nur im Abstand, den man zeigt.", verweis: "g-stufen", bsp: [
      ["지금 [갑니다].", "Ich komme jetzt.", "가 + ㅂ니다"],
      ["점심은 보통 회사에서 [먹습니다].", "Zu Mittag esse ich meistens in der Firma.", "먹 + 습니다"],
      ["저는 서울에 [삽니다].", "Ich wohne in Seoul.", "살다: ㄹ fällt weg → 삽니다"],
      ["회의는 세 시[입니다].", "Die Besprechung ist um drei.", "sein → 입니다"],
      ["어제 메일을 [보냈습니다].", "Ich habe die Mail gestern geschickt.", "Vergangenheit: 보냈 + 습니다"],
      ["부장님은 지금 [안 계십니다].", "Der Abteilungsleiter ist gerade nicht da.", "ehrend: 계시 + ㅂ니다"]
    ] },
    "a2-13n2": { kv: "stamm", mehr: "Bildung wie bei der Aussage, nur mit 까: Stamm + ㅂ니까 nach Vokal, 습니까 nach Konsonant. Stämme auf ㄹ: 삽니까. Sein: 입니까. Gegenüber dem Gesprächspartner steht fast immer die ehrende Form: -(으)십니까. Im Alltag außerhalb von Arbeit, Amt und Durchsagen fragt man mit -아요? oder -나요?.", bsp: [
      ["지금 시간 [있습니까]?", "Haben Sie gerade Zeit?"],
      ["어디에서 [오셨습니까]?", "Woher kommen Sie?", "ehrend, Vergangenheit"],
      ["이것이 [무엇입니까]?", "Was ist das?", "sein → 입니까"],
      ["언제 [출발합니까]?", "Wann fahren wir ab?"],
      ["[괜찮으십니까]?", "Geht es Ihnen gut?", "ehrend: 괜찮으시 + ㅂ니까"],
      ["다른 질문 [없습니까]?", "Gibt es keine weiteren Fragen?"]
    ] },
    "a2-13n3": { mehr: "Stamm + 겠습니다. Für das, was man selbst gleich tun wird – als Zusage, Ankündigung oder Meldung. In festen Wendungen: 알겠습니다 (verstanden), 잘 먹겠습니다 (vor dem Essen), 다녀오겠습니다 (beim Weggehen), 처음 뵙겠습니다 (bei der Vorstellung). Die höfliche Alltagsform dazu ist -(으)ㄹ게요.", bsp: [
      ["내일까지 [보내겠습니다].", "Ich schicke es bis morgen."],
      ["다시 [연락드리겠습니다].", "Ich melde mich wieder bei Ihnen."],
      ["열심히 [하겠습니다].", "Ich werde mein Bestes geben."],
      ["그럼 먼저 [시작하겠습니다].", "Dann fange ich schon einmal an."],
      ["잠시 후에 [도착하겠습니다].", "Wir kommen in Kürze an.", "typisch für Durchsagen"],
      ["제가 [확인하겠습니다].", "Ich prüfe das."]
    ] },
    "a2-13n4": { mehr: "Bei der Arbeit nennt man Menschen beim Rang: 사장님 (Chef), 부장님, 팀장님, 과장님, 대리님. Den Familiennamen kann man davorsetzen: 김 부장님. Gleichgestellte und Jüngere: Vorname oder voller Name + 씨 (민수 씨); in vielen Firmen heute einheitlich Name + 님. Familienname allein + 씨 (김 씨) klingt herablassend. Kunden spricht man mit 고객님 an, Lehrende und Ärzte mit 선생님. Ältere Kollegen nennt man oft 선배님.", bsp: [
      ["[팀장님], 잠깐 시간 있으세요?", "Herr Teamleiter, haben Sie kurz Zeit?"],
      ["김 [부장님]께 물어보세요.", "Fragen Sie Abteilungsleiter Kim."],
      ["민수 [씨], 이것 좀 봐 주세요.", "Minsu, schauen Sie sich das bitte an.", "Vorname + 씨: höflich unter Gleichgestellten"],
      ["[고객님], 잠시만 기다려 주세요.", "Bitte warten Sie einen Moment.", "Anrede für Kunden"],
      ["[선배님], 점심 드셨어요?", "Haben Sie schon zu Mittag gegessen?", "zu dienstälteren Kollegen"],
      ["[사장님], 여기 계산해 주세요.", "Zahlen, bitte.", "so spricht man auch Wirtsleute an"]
    ] },

    // ---------- a2-14 Aufgaben und Termine ----------
    "a2-14n1": { mehr: "Zwei Bauweisen. Verb: Stamm + 는 중이에요 (가는 중, 먹는 중; 살다 → 사는 중). Nomen: Nomen + 중이에요 (회의 중, 식사 중, 운전 중, 통화 중, 수업 중, 공사 중). Die Bedeutung ist wie bei -고 있어요, betont aber stärker: mitten drin, bitte nicht stören. Auf Schildern steht nur das Nomen mit 중: 영업 중 (geöffnet), 준비 중 (in Vorbereitung).", bsp: [
      ["지금 [운전 중]이에요.", "Ich fahre gerade Auto.", "Nomen + 중"],
      ["[식사 중]이세요?", "Sind Sie gerade beim Essen?"],
      ["지금 [알아보는 중]이에요.", "Ich erkundige mich gerade.", "Verb + 는 중"],
      ["아이가 [자는 중]이에요.", "Das Kind schläft gerade."],
      ["[수업 중]에는 휴대폰을 쓰면 안 돼요.", "Im Unterricht darf man das Handy nicht benutzen.", "중에 = während"],
      ["지금 [준비 중]입니다.", "Wir bereiten gerade vor.", "steht so auch auf Schildern"]
    ] },
    "a2-14n2": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ 예정이에요, nach Konsonant 을 예정이에요. 예정 heißt „Plan, Vorgesehenes“. Man nimmt es für Termine, Fahrpläne, Ankündigungen und geplante Abläufe. -(으)ㄹ 거예요 ist allgemeiner und drückt auch bloße Vermutung aus. Hinter einem Nomen: 예정 allein (도착 예정 = voraussichtliche Ankunft).", verweis: "g-vornomen", bsp: [
      ["다음 달에 [이사할 예정이에요].", "Nächsten Monat ziehen wir um.", "fest geplant"],
      ["비행기는 여섯 시에 [도착할 예정입니다].", "Das Flugzeug kommt planmäßig um sechs an."],
      ["내일은 집에 [있을 예정이에요].", "Morgen bleibe ich laut Plan zu Hause.", "있 → 을 예정"],
      ["언제 [시작할 예정이에요]?", "Wann soll es losgehen?"],
      ["회의는 한 시간 정도 [걸릴 예정이에요].", "Die Besprechung soll ungefähr eine Stunde dauern."]
    ] },
    "a2-14n3": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 놓다 (해요 → 해 놓다, 켜요 → 켜 놓다, 사요 → 사 놓다). Es bedeutet: etwas tun und in diesem Zustand lassen – meist, damit es später bereit ist. 놓았어요 wird im Gespräch zu 놨어요. -아/어 두다 bedeutet fast dasselbe und betont das Aufbewahren für später.", verweis: "g-anschluss", bsp: [
      ["저녁을 [만들어 놓았어요].", "Ich habe das Abendessen schon gemacht.", "es steht bereit"],
      ["표를 미리 [사 놓았어요].", "Ich habe die Karten schon im Voraus gekauft."],
      ["에어컨을 [켜 놓을게요].", "Ich schalte die Klimaanlage schon einmal ein."],
      ["문을 [열어 놓으세요].", "Lassen Sie die Tür offen."],
      ["여기에 [적어 놨어요].", "Ich habe es hier aufgeschrieben.", "놓았어요 → 놨어요"],
      ["주소를 [저장해 두세요].", "Speichern Sie die Adresse ab.", "두다: für später aufheben"]
    ] },
    "a2-14n4": { mehr: "에 대해서 steht hinter dem Nomen und heißt „über, zu, bezüglich“. 서 kann wegfallen: 에 대해. Vor einem Nomen heißt es 에 대한: 한국에 대한 책 (ein Buch über Korea). Typische Verben danach: 얘기하다, 생각하다, 설명하다, 물어보다, 알다.", bsp: [
      ["한국 문화[에 대해서] 알고 싶어요.", "Ich möchte mehr über die koreanische Kultur wissen."],
      ["그 일[에 대해서] 들었어요?", "Hast du davon gehört?"],
      ["가격[에 대해서] 물어봤어요.", "Ich habe nach dem Preis gefragt."],
      ["이 문제[에 대해] 설명해 주세요.", "Erklären Sie mir bitte dieses Problem.", "ohne 서"],
      ["한국[에 대한] 책을 읽고 있어요.", "Ich lese ein Buch über Korea.", "vor einem Nomen: 에 대한"],
      ["그것[에 대해서는] 잘 몰라요.", "Darüber weiß ich nicht viel."]
    ] },

    // ---------- a2-15 Amt und Formulare ----------
    "a2-15n1": { mehr: "Welche Form: Verben, 있다/없다 und jede Vergangenheit bekommen 나요 (가나요, 먹나요, 있나요, 갔나요). Stämme auf ㄹ verlieren das ㄹ (살다 → 사나요). Eigenschaftswörter bekommen ㄴ가요, nach Konsonant 은가요 (비싼가요, 좋은가요). Nomen: 인가요. Die Frage klingt vorsichtiger als -아요? und passt zu Fremden, an Schaltern und in Geschäften. Auf eine solche Frage antwortet man normal mit -아요/어요.", verweis: "g-vornomen", bsp: [
      ["여기에서 표를 [파나요]?", "Verkauft man hier Karten?", "팔다: ㄹ fällt weg → 파나요"],
      ["몇 시에 문을 [닫나요]?", "Um wie viel Uhr schließen Sie?", "Verb → 나요"],
      ["자리가 [있나요]?", "Ist ein Platz frei?", "있다 → 나요"],
      ["벌써 [끝났나요]?", "Ist es schon vorbei?", "Vergangenheit → 나요"],
      ["여기에서 [먼가요]?", "Ist es weit von hier?", "멀다 → 먼가요"],
      ["이 줄이 접수하는 [줄인가요]?", "Ist das die Schlange für die Anmeldung?", "Nomen → 인가요"]
    ] },
    "a2-15n2": { kv: "stamm", mehr: "Bildung: Stamm + 려면, nach Konsonant 으려면. Stämme auf ㄹ bekommen kein 으 (만들려면). Es ist die Kurzform von -(으)려고 하면: „wenn man vorhat, zu …“. Danach folgt, was man dafür tun muss oder braucht – oft mit -아야 해요, 필요해요 oder einer Frage.", verweis: "g-anschluss", bsp: [
      ["시청에 [가려면] 몇 번 버스를 타요?", "Welchen Bus nimmt man, wenn man zum Rathaus will?"],
      ["한국어를 [잘하려면] 매일 연습해야 해요.", "Wer gut Koreanisch können will, muss täglich üben."],
      ["계좌를 [만들려면] 신분증이 필요해요.", "Um ein Konto zu eröffnen, braucht man einen Ausweis.", "만들다: Stamm auf ㄹ, kein 으"],
      ["표를 [받으려면] 어디로 가야 해요?", "Wohin muss ich gehen, um die Karte zu bekommen?", "받 → 으려면"],
      ["일찍 [도착하려면] 지금 출발해야 해요.", "Wenn wir früh ankommen wollen, müssen wir jetzt los."],
      ["[예약하려면] 어떻게 해요?", "Wie reserviert man?"]
    ] },
    "a2-15n3": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 주시겠어요? Es enthält -(으)시- (ehrend) und -겠- (Absicht): „Wären Sie so freundlich, …?“ Stufen der Bitte, von einfach zu sehr höflich: -아/어 주세요 → -아/어 주시겠어요? → -아/어 주실 수 있을까요? Förmlich: -아/어 주시겠습니까?", bsp: [
      ["다시 한번 [말씀해 주시겠어요]?", "Würden Sie das bitte noch einmal sagen?"],
      ["여기에서 잠시 [기다려 주시겠어요]?", "Würden Sie bitte kurz hier warten?"],
      ["사진 좀 [찍어 주시겠어요]?", "Würden Sie bitte ein Foto von uns machen?"],
      ["조금 천천히 [말해 주시겠어요]?", "Würden Sie bitte etwas langsamer sprechen?"],
      ["이것 좀 [도와주시겠어요]?", "Würden Sie mir bitte hierbei helfen?"],
      ["자리를 좀 [바꿔 주시겠어요]?", "Würden Sie bitte den Platz tauschen?"]
    ] },
    "a2-15n4": { mehr: "말고 steht hinter einem Nomen: „nicht dieses, sondern“. Hinter einem Verb heißt es -지 말고 (nicht …, sondern …). 말고도 bedeutet „außer … auch noch“. 없이 steht hinter einem Nomen und heißt „ohne“; als ganzer Satzteil auch 이/가 없이.", bsp: [
      ["이거 [말고] 저거 주세요.", "Nicht das hier, geben Sie mir das dort."],
      ["오늘 [말고] 내일 만나요.", "Treffen wir uns nicht heute, sondern morgen."],
      ["커피 [말고] 다른 거 있어요?", "Gibt es etwas anderes als Kaffee?"],
      ["이거 [말고도] 또 있어요?", "Gibt es außer dem hier noch etwas?", "말고도 = außer … auch"],
      ["설탕 [없이] 주세요.", "Ohne Zucker, bitte."],
      ["휴대폰 [없이] 못 살아요.", "Ohne Handy kann ich nicht leben."]
    ] },

    // ---------- a2-16 Bank und Geld ----------
    "a2-16n1": { mehr: "Welche Form: Verben, 있다/없다 und jede Vergangenheit bekommen 는지 (가는지, 있는지, 갔는지; 살다 → 사는지). Eigenschaftswörter bekommen ㄴ지, nach Konsonant 은지 (비싼지, 좋은지). Nomen: 인지; mit Fragewörtern oft verkürzt (뭐인지 → 뭔지, 누구인지 → 누군지, 어디인지 → 어딘지). Für das, was noch kommt: -(으)ㄹ지 (갈지 모르겠어요). Dahinter stehen Verben wie 알다, 모르다, 궁금하다, 물어보다, 확인하다. Ohne Fragewort heißt es „ob“.", verweis: "g-vornomen", bsp: [
      ["화장실이 어디에 [있는지] 아세요?", "Wissen Sie, wo die Toilette ist?"],
      ["몇 시에 [시작하는지] 몰라요.", "Ich weiß nicht, wann es anfängt."],
      ["그 사람이 [누군지] 알아요?", "Weißt du, wer das ist?", "누구인지 → 누군지"],
      ["왜 [늦었는지] 물어봤어요.", "Ich habe gefragt, warum er zu spät war.", "Vergangenheit → 는지"],
      ["이게 [맞는지] 확인해 주세요.", "Sehen Sie bitte nach, ob das stimmt.", "ohne Fragewort: ob"],
      ["내일 갈 수 [있을지] 모르겠어요.", "Ich weiß nicht, ob ich morgen kommen kann.", "was noch kommt → 을지"]
    ] },
    "a2-16n2": { mehr: "에 hinter einer Zeit- oder Mengenangabe heißt „pro“: 하루에 (pro Tag), 일주일에 (pro Woche), 한 달에 (pro Monat), 일 년에 (pro Jahr), 한 시간에 (pro Stunde), 한 개에 (pro Stück), 한 명에 (pro Person). Dahinter folgt, wie oft oder wie viel. 마다 (jeder) und 씩 (je) drücken Ähnliches aus: 날마다, 하나씩.", bsp: [
      ["일주일[에] 두 번 운동해요.", "Ich mache zweimal pro Woche Sport."],
      ["하루[에] 커피를 세 잔 마셔요.", "Ich trinke drei Tassen Kaffee am Tag."],
      ["한 시간[에] 만 원이에요.", "Es kostet 10.000 Won pro Stunde."],
      ["일 년[에] 한 번 한국에 가요.", "Einmal im Jahr fahre ich nach Korea."],
      ["한 명[에] 얼마예요?", "Was kostet es pro Person?"],
      ["한 개[에] 이천 원이에요.", "Ein Stück kostet 2.000 Won."]
    ] },
    "a2-16n3": { mehr: "Alle drei stehen hinter der Zahl. 이상 schließt die Zahl ein („ab, mindestens“), 이하 ebenso („bis, höchstens“). Ohne die Zahl selbst: 초과 (über) und 미만 (unter) – so steht es in Vorschriften. 정도 und 쯤 heißen „ungefähr“; 정도 ist etwas sachlicher. Vor der Zahl sagt man 약 (ungefähr).", bsp: [
      ["삼만 원 [이상] 사면 배송이 무료예요.", "Ab 30.000 Won Einkauf ist die Lieferung gratis."],
      ["열여덟 살 [이상]만 들어갈 수 있어요.", "Nur ab 18 Jahren darf man hinein."],
      ["십 킬로 [이하]는 무료예요.", "Bis zehn Kilo ist es gratis."],
      ["한 시간 [정도] 기다렸어요.", "Ich habe ungefähr eine Stunde gewartet."],
      ["열 명 [정도] 올 거예요.", "Es kommen ungefähr zehn Leute."],
      ["어느 [정도] 이해했어요.", "Ich habe es einigermaßen verstanden.", "어느 정도 = einigermaßen"]
    ] },
    "a2-16n4": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 드릴까요? oder 드리겠습니다. 드리다 ist die ehrende Form von 주다: Man tut etwas für jemanden, den man ehrt. So spricht Personal in Bank, Geschäft, Hotel. Als Kunde hört man es vor allem; selbst verwendet man es gegenüber Älteren (제가 해 드릴게요). Antwort: 네, 부탁드립니다 oder 괜찮습니다.", verweis: "g-ehrend", bsp: [
      ["뭘 [도와 드릴까요]?", "Womit kann ich Ihnen helfen?"],
      ["영수증 [드릴까요]?", "Möchten Sie den Beleg?"],
      ["봉투에 [넣어 드릴까요]?", "Soll ich es Ihnen in ein Sackerl geben?"],
      ["바로 [안내해 드리겠습니다].", "Ich begleite Sie gleich hin."],
      ["제가 [들어 드릴게요].", "Ich trage das für Sie.", "selbst gegenüber Älteren"],
      ["사진 [찍어 드릴까요]?", "Soll ich ein Foto von Ihnen machen?"]
    ] },

    // ---------- a2-17 Beim Arzt: Beschwerden ----------
    "a2-17n1": { kv: "stamm", mehr: "Bildung: Stamm + ㄴ 지, nach Konsonant 은 지; danach die Dauer und 됐어요 (ist geworden). Bei Stämmen auf ㄹ fällt das ㄹ weg (살다 → 산 지). Wörtlich: „Seit ich gekommen bin, ist ein Jahr geworden.“ Statt 됐어요 auch 지났어요 (ist vergangen) oder 넘었어요 (ist mehr als). Frage: -(으)ㄴ 지 얼마나 됐어요? Zwischen ㄴ und 지 steht ein Leerzeichen – anders als bei -는지 (ob).", verweis: "g-vornomen", bsp: [
      ["한국어를 [배운 지] 일 년 됐어요.", "Ich lerne seit einem Jahr Koreanisch."],
      ["[결혼한 지] 오 년 됐어요.", "Wir sind seit fünf Jahren verheiratet."],
      ["여기 [산 지] 얼마나 됐어요?", "Wie lange wohnen Sie schon hier?", "살다: ㄹ fällt weg → 산 지"],
      ["밥 [먹은 지] 한 시간밖에 안 됐어요.", "Ich habe erst vor einer Stunde gegessen.", "먹 → 은 지"],
      ["못 [본 지] 오래됐어요.", "Wir haben uns lange nicht gesehen."],
      ["이 약을 [먹은 지] 삼 일 됐어요.", "Ich nehme dieses Medikament seit drei Tagen."]
    ] },
    "a2-17n2": { mehr: "Stamm + 기 macht aus dem Verb ein Nomen („das Gehen“). Dahinter steht ein Eigenschaftswort: 힘들다 (anstrengend), 어렵다 (schwer), 쉽다 (leicht), 좋다 (gut), 편하다 (bequem), 싫다 (unangenehm). Zwischen 기 und dem Eigenschaftswort kann 가 stehen: 걷기가 힘들어요. Beim Arzt beschreibt man damit, was nicht mehr gut geht.", bsp: [
      ["계단을 [올라가기 힘들어요].", "Das Stiegensteigen fällt mir schwer."],
      ["이 약은 [먹기 쉬워요].", "Dieses Medikament ist leicht einzunehmen."],
      ["한국어 발음은 [따라 하기 어려워요].", "Die koreanische Aussprache ist schwer nachzusprechen."],
      ["아침에 [일어나기 싫어요].", "In der Früh mag ich nicht aufstehen.", "싫다 = nicht mögen"],
      ["글씨가 작아서 [읽기 힘들어요].", "Die Schrift ist klein, das Lesen ist mühsam."],
      ["요즘 [숨쉬기가] 좀 편해졌어요.", "Zurzeit atme ich wieder etwas leichter.", "mit 가"]
    ] },
    "a2-17n3": { kv: "stamm", mehr: "-(으)ㄹ 때 (als, wenn) + 마다 (jeder): „jedes Mal, wenn“. Bildung wie bei -(으)ㄹ 때: Stamm + ㄹ 때마다, nach Konsonant 을 때마다. Hinter einem Nomen nur 때마다 oder 마다: 식사 때마다, 주말마다.", verweis: "g-vornomen", bsp: [
      ["[웃을 때마다] 배가 아파요.", "Jedes Mal, wenn ich lache, tut der Bauch weh.", "웃 → 을 때마다"],
      ["[걸을 때마다] 무릎에서 소리가 나요.", "Bei jedem Schritt knackt das Knie.", "걷다 → 걸을"],
      ["한국에 [갈 때마다] 선물을 사요.", "Jedes Mal, wenn ich nach Korea fahre, kaufe ich Geschenke."],
      ["[만날 때마다] 반가워요.", "Jedes Mal, wenn wir uns treffen, freue ich mich."],
      ["이 노래를 [들을 때마다] 그때가 생각나요.", "Immer wenn ich dieses Lied höre, denke ich an damals.", "듣다 → 들을"],
      ["[식사 때마다] 약을 드세요.", "Nehmen Sie das Medikament zu jeder Mahlzeit.", "Nomen + 때마다"]
    ] },
    "a2-17n4": { mehr: "Für Beschwerden gibt es feste Verben. 나다 (herauskommen): 열이 나다 (Fieber), 기침이 나다 (Husten), 콧물이 나다 (Schnupfen), 땀이 나다 (schwitzen), 피가 나다 (bluten), 화가 나다 (wütend werden). 걸리다 (hängen bleiben) mit 에: 감기에 걸리다, 독감에 걸리다. 생기다 (entstehen): 염증이 생기다, 문제가 생기다. 들다: 멍이 들다 (einen blauen Fleck bekommen). Das Deutsche sagt meist „haben“; im Koreanischen ist die Beschwerde selbst das Subjekt.", bsp: [
      ["아이가 [열이 나요].", "Das Kind hat Fieber."],
      ["어제부터 [기침이 나요].", "Seit gestern huste ich."],
      ["손에서 [피가 나요].", "Die Hand blutet."],
      ["[감기에 걸려서] 목이 아파요.", "Ich bin erkältet und habe Halsweh.", "걸리다 mit 에"],
      ["눈에 [염증이 생겼어요].", "Ich habe eine Entzündung am Auge."],
      ["매운 걸 먹으면 [땀이 나요].", "Wenn ich Scharfes esse, schwitze ich."]
    ] },

    // ---------- a2-18 Untersuchung, Apotheke, Kinderarzt ----------
    "a2-18n1": { mehr: "Stamm + 는 게 좋겠어요. 게 ist die Kurzform von 것이 (das …-en). Wörtlich: „Das …-en wäre gut.“ Bei Stämmen auf ㄹ fällt das ㄹ weg (만들다 → 만드는 게). Verneint: 안 -는 게 좋겠어요 oder -지 않는 게 좋겠어요. Ohne 겠 (-는 게 좋아요) ist es eine allgemeine Feststellung: „es ist gut, zu …“.", verweis: "g-vornomen", bsp: [
      ["의사한테 [물어보는 게 좋겠어요].", "Sie fragen besser den Arzt."],
      ["오늘은 일찍 [자는 게 좋겠어요].", "Heute gehen wir besser früh schlafen."],
      ["미리 [예약하는 게 좋겠어요].", "Wir reservieren besser im Voraus."],
      ["지금은 [안 가는 게 좋겠어요].", "Jetzt gehen wir besser nicht hin.", "verneint"],
      ["택시를 [타는 게 좋겠어요].", "Wir nehmen besser ein Taxi."],
      ["아침을 [먹는 게 좋아요].", "Es ist gut, zu frühstücken.", "ohne 겠: allgemeine Feststellung"]
    ] },
    "a2-18n2": { mehr: "Stamm + 지 말고. Vorn steht, was man nicht tun soll, hinten, was stattdessen – als Aufforderung oder Vorschlag. Hinter einem Nomen heißt es 말고 (이거 말고 저거). Im vertrauten Ton endet der Satz ohne 요: 울지 말고 말해 봐.", bsp: [
      ["[기다리지 말고] 먼저 드세요.", "Warten Sie nicht, essen Sie schon."],
      ["[뛰지 말고] 천천히 걸어.", "Lauf nicht, geh langsam.", "vertraute Form"],
      ["[울지 말고] 말해 봐.", "Wein nicht, sag es mir.", "vertraute Form"],
      ["택시 [타지 말고] 지하철 타요.", "Nehmen wir nicht das Taxi, sondern die U-Bahn."],
      ["[포기하지 말고] 한 번 더 해 봐요.", "Gib nicht auf, versuch es noch einmal."],
      ["약만 [먹지 말고] 병원에 가세요.", "Nehmen Sie nicht nur Medikamente, gehen Sie zum Arzt."]
    ] },
    "a2-18n3": { kv: "stamm", mehr: "Aufbau: Stamm + (으)시 + 어야 해요 → -(으)셔야 해요. Nach Vokal 셔야 (가셔야), nach Konsonant 으셔야 (받으셔야). Mit den ehrenden Verben: 드셔야 해요 (essen, einnehmen), 주무셔야 해요 (schlafen), 계셔야 해요 (bleiben). Gleichbedeutend: -(으)셔야 돼요; förmlich: -(으)셔야 합니다. So sagen Ärzte und Personal, was man tun muss.", verweis: "g-ehrend", bsp: [
      ["내일 다시 [오셔야 해요].", "Sie müssen morgen noch einmal kommen."],
      ["삼십 분 정도 [기다리셔야 해요].", "Sie müssen ungefähr dreißig Minuten warten."],
      ["약을 꼭 [드셔야 해요].", "Sie müssen das Medikament unbedingt nehmen.", "먹다 → 드시다"],
      ["여기에 [서명하셔야 합니다].", "Sie müssen hier unterschreiben.", "förmlich"],
      ["푹 [쉬셔야 돼요].", "Sie müssen sich richtig ausruhen.", "돼요 statt 해요"],
      ["먼저 접수를 [하셔야 해요].", "Sie müssen sich zuerst anmelden."]
    ] },
    "a2-18n4": { mehr: "Bausteine: Zeitraum + 에 (하루에 = pro Tag), Anzahl + 번 mit den koreanischen Zahlen (한 번, 두 번, 세 번), Menge + 씩 (je). Zählwörter: 알 (Tablette), 봉지 (Säckchen), 방울 (Tropfen). Zeitpunkt: 식전 (vor dem Essen), 식후 (nach dem Essen), 자기 전에 (vor dem Schlafen). Auf dem Medikamentensäckchen steht meist: 1일 3회, 식후 30분.", bsp: [
      ["[하루에 두 번] 드세요.", "Nehmen Sie es zweimal täglich."],
      ["[한 번에 두 알씩] 드세요.", "Nehmen Sie jeweils zwei Tabletten."],
      ["[식후에] 드세요.", "Nehmen Sie es nach dem Essen."],
      ["[자기 전에] 한 알 드세요.", "Nehmen Sie eine Tablette vor dem Schlafen."],
      ["[삼 일 동안] 드세요.", "Nehmen Sie es drei Tage lang."],
      ["[여섯 시간마다] 먹이세요.", "Geben Sie es dem Kind alle sechs Stunden.", "먹이다 = zu essen geben"]
    ] },

    // ---------- a2-19 Reise planen ----------
    "a2-19n1": { kv: "stamm", mehr: "Bildung: Stamm + ㄹ까 해요, nach Konsonant 을까 해요. Es ist ein Gedanke, noch kein Entschluss: „Ich überlege, ob ich …“. Fester sind -(으)려고 해요 (habe vor) und -기로 했어요 (habe beschlossen). Nur für die eigenen Pläne; gefragt wird damit nicht.", bsp: [
      ["오늘은 일찍 [잘까 해요].", "Ich überlege, heute früh schlafen zu gehen."],
      ["저녁에 삼겹살을 [먹을까 해요].", "Ich überlege, am Abend Samgyeopsal zu essen.", "먹 → 을까"],
      ["내년에 한국어 시험을 [볼까 해요].", "Ich überlege, nächstes Jahr die Koreanischprüfung zu machen."],
      ["주말에 부모님 댁에 [갈까 해요].", "Ich überlege, am Wochenende zu den Eltern zu fahren."],
      ["머리를 좀 [자를까 해요].", "Ich überlege, mir die Haare schneiden zu lassen."],
      ["차를 [바꿀까 해요].", "Ich überlege, ein anderes Auto zu nehmen."]
    ] },
    "a2-19n2": { mehr: "Stamm + 거나, egal ob Konsonant oder Vokal. Es verbindet Verben und Eigenschaftswörter mit „oder“. Zwischen zwei Nomen nimmt man stattdessen (이)나: 버스나 지하철. In der Vergangenheit: -았거나.", bsp: [
      ["저녁에는 책을 [읽거나] 영화를 봐요.", "Am Abend lese ich oder schaue einen Film."],
      ["[전화하거나] 메시지를 보내세요.", "Rufen Sie an oder schicken Sie eine Nachricht."],
      ["아프면 약을 [먹거나] 병원에 가요.", "Wenn ich krank bin, nehme ich Medikamente oder gehe zum Arzt."],
      ["너무 [덥거나] 추우면 안 나가요.", "Wenn es zu heiß oder zu kalt ist, gehe ich nicht hinaus."],
      ["카드로 [내거나] 현금으로 내세요.", "Zahlen Sie mit Karte oder bar."],
      ["모르면 [물어보거나] 검색해요.", "Wenn ich etwas nicht weiß, frage ich oder suche im Internet."]
    ] },
    "a2-19n3": { mehr: "Stamm + 기, danach 좋다 (gut), 편하다 (bequem), 불편하다 (unbequem), 쉽다, 어렵다. Wörtlich: „zum Gehen gut“. Vor einem Nomen: -기 좋은, -기 편한 (걷기 좋은 길 = ein Weg, auf dem man gut geht). Damit beschreibt man Orte, Dinge und Zeiten nach ihrem Nutzen.", bsp: [
      ["이 신발은 [걷기 편해요].", "In diesen Schuhen geht man bequem."],
      ["여기는 아이하고 [놀기 좋아요].", "Hier kann man gut mit Kindern spielen."],
      ["오늘은 [산책하기 좋은] 날씨예요.", "Heute ist gutes Wetter zum Spazierengehen.", "vor dem Nomen: 좋은"],
      ["이 앱은 [쓰기 편해요].", "Diese App ist bequem zu bedienen."],
      ["혼자 [살기 좋은] 동네예요.", "Das ist eine gute Gegend, um allein zu wohnen."],
      ["지하철역이 가까워서 [다니기 편해요].", "Die U-Bahn ist nah, man kommt bequem überallhin."]
    ] },
    "a2-19n4": { mehr: "박 zählt Nächte, 일 zählt Tage; beide mit den sinokoreanischen Zahlen (일, 이, 삼). 이 박 삼 일 = zwei Nächte, drei Tage. Mit 로 sagt man, für wie lange man bucht oder fährt: 일 박 이 일로. 당일 heißt „am selben Tag“; 당일치기 ist ein Tagesausflug ohne Übernachtung. Im Text schreibt man meist Ziffern: 2박 3일.", bsp: [
      ["[일 박 이 일]로 부산에 가요.", "Wir fahren für eine Nacht und zwei Tage nach Busan."],
      ["[삼 박 사 일] 동안 제주도에 있었어요.", "Wir waren drei Nächte und vier Tage auf Jeju."],
      ["[이 박] 예약했어요.", "Ich habe zwei Nächte gebucht."],
      ["[당일] 예약도 돼요?", "Kann man auch am selben Tag buchen?"],
      ["[당일치기]로 갔다 왔어요.", "Wir waren für einen Tagesausflug dort."],
      ["[하루 더] 있을 수 있어요?", "Können wir einen Tag länger bleiben?"]
    ] },

    // ---------- a2-20 Flughafen, Unterkunft, Pannen ----------
    "a2-20n1": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 있어요. Es beschreibt nicht die Handlung, sondern den Zustand danach: 앉아요 = sich setzen, 앉아 있어요 = sitzen. Typische Verben: 앉다, 서다 (stehen), 눕다 (liegen: 누워 있어요), 열리다, 닫히다, 켜지다, 꺼지다, 남다 (übrig sein), 들다 (drin sein: 들어 있어요), 붙다 (kleben). Zum Vergleich: -고 있어요 heißt „gerade dabei sein“. Bei Kleidung sagt man -고 있어요 (입고 있어요 = anhaben). Ehrend: -아/어 계세요.", verweis: "g-anschluss", bsp: [
      ["사람들이 줄을 [서 있어요].", "Die Leute stehen in der Schlange."],
      ["아이가 침대에 [누워 있어요].", "Das Kind liegt im Bett.", "눕다 → 누워"],
      ["가방 안에 여권이 [들어 있어요].", "Im Rucksack ist der Pass."],
      ["자리가 두 개 [남아 있어요].", "Zwei Plätze sind noch frei."],
      ["가게 문이 [닫혀 있어요].", "Das Geschäft ist zu."],
      ["할머니께서 [앉아 계세요].", "Die Großmutter sitzt.", "ehrend: 계세요"]
    ] },
    "a2-20n2": { mehr: "Viele Verben haben ein Gegenstück für „es geschieht von selbst“. Das Ding steht dann mit 이/가, nicht mit 을/를. Paare: 열다 – 열리다 (öffnen – aufgehen), 닫다 – 닫히다 (schließen – zugehen), 켜다 – 켜지다 (einschalten – angehen), 끄다 – 꺼지다 (ausschalten – ausgehen), 잠그다 – 잠기다 (zusperren – verschlossen sein), 바꾸다 – 바뀌다 (ändern – sich ändern), 보다 – 보이다 (sehen – zu sehen sein), 듣다 – 들리다 (hören – zu hören sein). Mit 안 davor beschreibt man eine Panne: 문이 안 열려요.", bsp: [
      ["창문이 안 [닫혀요].", "Das Fenster geht nicht zu."],
      ["텔레비전이 안 [켜져요].", "Der Fernseher geht nicht an."],
      ["문이 [잠겼어요].", "Die Tür ist zugesperrt.", "잠그다 – 잠기다"],
      ["일정이 [바뀌었어요].", "Der Zeitplan hat sich geändert.", "바꾸다 – 바뀌다"],
      ["여기에서 바다가 [보여요].", "Von hier sieht man das Meer.", "보다 – 보이다"],
      ["소리가 잘 안 [들려요].", "Man hört es nicht gut.", "듣다 – 들리다"]
    ] },
    "a2-20n3": { mehr: "Für Pannen gibt es feste Muster. 안 돼요 = funktioniert nicht (와이파이, 카드, 인터넷, 결제). 안 나와요 = es kommt nichts heraus (물, 소리, 화면, 영수증). 안 켜져요 = geht nicht an. 안 열려요 = geht nicht auf. 고장 났어요 = ist kaputt. 막혔어요 = ist verstopft. 새요 = ist undicht. Das Gerät steht mit 이/가.", bsp: [
      ["인터넷이 [안 돼요].", "Das Internet funktioniert nicht."],
      ["소리가 [안 나와요].", "Es kommt kein Ton."],
      ["카드 결제가 [안 돼요].", "Die Kartenzahlung funktioniert nicht."],
      ["불이 [안 켜져요].", "Das Licht geht nicht an."],
      ["난방이 [안 돼요].", "Die Heizung funktioniert nicht."],
      ["화면이 [안 나와요].", "Der Bildschirm bleibt schwarz."]
    ] },
    "a2-20n4": { mehr: "Bildung: höfliche Gegenwart ohne 요, dann 주실 수 있어요? Wörtlich: „Können Sie mir … geben, tun?“ Es fragt nach der Möglichkeit und lässt dem anderen Raum, Nein zu sagen. Noch weicher: -아/어 주실 수 있을까요? Wenn man selbst etwas darf: -아/어도 될까요?", bsp: [
      ["택시를 [불러 주실 수 있어요]?", "Könnten Sie ein Taxi rufen?", "부르다 → 불러"],
      ["좀 더 일찍 [와 주실 수 있어요]?", "Könnten Sie etwas früher kommen?"],
      ["소리를 좀 [줄여 주실 수 있어요]?", "Könnten Sie die Lautstärke etwas verringern?"],
      ["내일 아침에 [깨워 주실 수 있어요]?", "Könnten Sie mich morgen früh wecken?"],
      ["이걸 영어로 [설명해 주실 수 있어요]?", "Könnten Sie das auf Englisch erklären?"],
      ["조금만 [기다려 주실 수 있을까요]?", "Könnten Sie vielleicht einen Moment warten?", "noch weicher: 있을까요"]
    ] },

    // ---------- a2-21 Familienfeste ----------
    "a2-21n1": { kv: "stamm", mehr: "-(으)시- hängt am Stamm: nach Vokal 시, nach Konsonant 으시. Dahinter kommt die Zeit. Gegenwart: -(으)세요. Vergangenheit: -(으)셨어요 (가셨어요, 읽으셨어요). Zukunft: -(으)실 거예요. Höfliches Angebot oder Frage nach dem Wunsch: -(으)시겠어요? Die eigenen ehrenden Verben bilden die Zeiten genauso: 드셨어요, 주무셨어요, 계셨어요. Stämme auf ㄹ verlieren das ㄹ (살다 → 사셨어요).", verweis: "g-ehrend", bsp: [
      ["어머님이 [전화하셨어요].", "Die Mutter hat angerufen."],
      ["어디에서 [사셨어요]?", "Wo haben Sie gewohnt?", "살다: ㄹ fällt weg → 사셨어요"],
      ["이 책 [읽으셨어요]?", "Haben Sie dieses Buch gelesen?", "읽 → 으셨어요"],
      ["많이 [드셨어요]?", "Haben Sie genug gegessen?", "먹다 → 드시다"],
      ["내일 [오실 거예요]?", "Kommen Sie morgen?"],
      ["뭐 [드시겠어요]?", "Was möchten Sie essen?", "höfliche Frage nach dem Wunsch"]
    ] },
    "a2-21n2": { mehr: "께서 ersetzt 이/가 bei Personen, die man ehrt: Großeltern, Schwiegereltern, Lehrende, Vorgesetzte. Als Thema: 께서는. Mit „auch“: 께서도. Das Verb steht dann ebenfalls ehrend (-(으)시- oder eigenes Verb). Im Alltag hört man oft einfach 이/가 mit ehrendem Verb; 께서 klingt besonders respektvoll und passt zu Feiertagen, Ansprachen und Briefen.", verweis: "g-ehrend", bsp: [
      ["할아버지[께서] 오셨어요.", "Der Großvater ist gekommen."],
      ["선생님[께서] 말씀하셨어요.", "Die Lehrerin hat es gesagt."],
      ["어머님[께서] 만드신 김치예요.", "Das ist Kimchi, das die Mutter gemacht hat."],
      ["아버님[께서는] 지금 주무세요.", "Der Vater schläft gerade.", "als Thema: 께서는"],
      ["부모님[께서도] 건강하세요?", "Sind Ihre Eltern auch gesund?", "auch: 께서도"]
    ] },
    "a2-21n3": { mehr: "Die wichtigsten Paare: 이름 → 성함 (Name), 나이 → 연세 (Alter), 생일 → 생신 (Geburtstag), 집 → 댁 (Zuhause), 말 → 말씀 (Worte), 밥 → 진지 (Mahlzeit), 사람 → 분 (Person). Kinder anderer: 아드님 (Sohn), 따님 (Tochter). Gefragt wird mit 어떻게 되세요?: 성함이 어떻게 되세요? Für sich selbst verwendet man diese Wörter nicht. Ausnahme: 말씀 sagt man auch bescheiden über das, was man selbst einem Älteren sagt (말씀드리다).", verweis: "g-ehrend", bsp: [
      ["할머니 [생신]이 언제예요?", "Wann hat die Großmutter Geburtstag?"],
      ["[연세]가 많으세요.", "Er ist schon sehr alt."],
      ["선생님 [댁]에 갔어요.", "Ich war bei der Lehrerin zu Hause."],
      ["[성함]을 여기에 써 주세요.", "Schreiben Sie bitte Ihren Namen hierher."],
      ["저 [분]이 사장님이세요.", "Die Person dort ist der Chef.", "사람 → 분"],
      ["[말씀]드릴 게 있어요.", "Ich möchte Ihnen etwas sagen.", "bescheiden über das eigene Sagen"]
    ] },
    "a2-21n4": { mehr: "Die meisten Wünsche sind Aufforderungen: 건강하세요 (bleiben Sie gesund), 행복하세요, 조심히 가세요, 잘 다녀오세요. Glückwünsche enden auf 축하해요, zu Älteren 축하드려요 oder 축하드립니다. Förmlich und schriftlich: Stamm + 기를 바랍니다 („ich hoffe, dass“), gesprochen auch -길 바라요. Feste Wünsche zu Feiertagen: 새해 복 많이 받으세요 (Neujahr), 즐거운 추석 보내세요 (Chuseok), 메리 크리스마스.", bsp: [
      ["즐거운 추석 [보내세요].", "Schöne Chuseok-Feiertage."],
      ["생일 [축하해요]!", "Alles Gute zum Geburtstag!"],
      ["조심히 [들어가세요].", "Kommen Sie gut nach Hause.", "beim Abschied"],
      ["잘 [다녀오세요].", "Gute Reise. Kommen Sie gut wieder."],
      ["좋은 일만 [있기를 바랍니다].", "Ich wünsche Ihnen nur Gutes.", "förmlich, schriftlich"],
      ["빨리 [나으세요].", "Gute Besserung."]
    ] },

    // ---------- a2-22 Kindergarten und Schule ----------
    "a2-22n1": { mehr: "-대요 ist die Kurzform von -다고 해요. Verb in der Gegenwart: -ㄴ대요 nach Vokal (간대요), -는대요 nach Konsonant (먹는대요); Stämme auf ㄹ verlieren es (살다 → 산대요). Eigenschaftswort, 있다/없다: Stamm + 대요 (바쁘대요, 있대요). Vergangenheit: -았대요 / -었대요. Zukunft: -(으)ㄹ 거래요. Als Frage: „Hast du gehört, ob …?“ (온대요?). Man gibt damit weiter, was man gehört hat, ohne sich selbst dafür zu verbürgen.", verweis: "g-weitersagen", bsp: [
      ["아내가 조금 [늦는대요].", "Meine Frau sagt, sie kommt etwas später.", "Verb nach Konsonant → 는대요"],
      ["내일은 날씨가 [좋대요].", "Morgen soll das Wetter schön sein.", "Eigenschaftswort → 대요"],
      ["그 식당이 [맛있대요].", "Das Lokal soll gut sein."],
      ["친구는 벌써 [먹었대요].", "Mein Freund hat schon gegessen, sagt er.", "Vergangenheit → 었대요"],
      ["아이가 배가 [아프대요].", "Das Kind sagt, es hat Bauchweh."],
      ["언제 [온대요]?", "Wann kommt er, hat er gesagt?", "als Frage"]
    ] },
    "a2-22n2": { kv: "stamm", mehr: "Zwei verschiedene Kurzformen. Aufforderung: Stamm + 래요, nach Konsonant 으래요 – kurz für -(으)라고 해요 („ich soll, wir sollen“). Verneint: -지 말래요. Nomen: Nomen + 이래요, nach Vokal 래요 – kurz für (이)라고 해요 („es ist, heißt es“); verneint 아니래요. Achtung: -(으)ㄹ래요 mit ㄹ unten heißt „ich will“ (갈래요), -(으)래요 heißt „ich soll“ (가래요).", verweis: "g-weitersagen", bsp: [
      ["선생님이 내일 일찍 [오래요].", "Die Lehrerin sagt, wir sollen morgen früh kommen.", "오 + 래요"],
      ["의사가 약을 [먹으래요].", "Der Arzt sagt, ich soll Medikamente nehmen.", "먹 → 으래요"],
      ["엄마가 [뛰지 말래요].", "Mama sagt, wir sollen nicht laufen.", "verneint: 지 말래요"],
      ["저 사람이 [선생님이래요].", "Die Person dort ist Lehrerin, heißt es.", "Nomen nach Konsonant → 이래요"],
      ["오늘이 [휴일이래요].", "Heute ist Feiertag, heißt es."],
      ["그건 [아니래요].", "Das stimmt nicht, heißt es.", "verneint: 아니래요"]
    ] },
    "a2-22n3": { mehr: "Verb: Stamm + 는 편이에요 (먹는 편, 자는 편). Eigenschaftswort: Stamm + ㄴ 편이에요, nach Konsonant 은 편이에요 (큰 편, 작은 편). 편 heißt „Seite“: Etwas gehört eher auf die eine Seite. Man sagt damit eine Einschätzung, ohne sich festzulegen – bei Eigenschaften von Menschen sehr üblich. Bei Verben steht meist ein Wort wie 잘, 많이, 자주 davor.", verweis: "g-vornomen", bsp: [
      ["저는 일찍 [일어나는 편이에요].", "Ich stehe eher früh auf."],
      ["매운 음식을 잘 [먹는 편이에요].", "Scharfes Essen vertrage ich ganz gut."],
      ["키가 [큰 편이에요].", "Er ist eher groß."],
      ["이 동네는 [조용한 편이에요].", "Diese Gegend ist eher ruhig."],
      ["요즘은 좀 [바쁜 편이에요].", "Zurzeit habe ich eher viel zu tun."],
      ["우리 아이는 말이 [많은 편이에요].", "Unser Kind redet eher viel.", "많 → 은 편"]
    ] },
    "a2-22n4": { mehr: "Stamm + 게 됐어요. Es heißt: Es hat sich so ergeben – ohne dass man es selbst entschieden hat –, oder es ist jetzt so weit. Deutsch oft „inzwischen“, „dann doch“, „es kam dazu, dass“. In der Gegenwart, -게 돼요, für das, was sich regelmäßig so ergibt. Verneint: 못 -게 됐어요 (kann nun doch nicht). 알게 됐어요 = erfahren, kennenlernen.", bsp: [
      ["일 때문에 한국에 [오게 됐어요].", "Wegen der Arbeit bin ich nach Korea gekommen.", "es hat sich so ergeben"],
      ["이제 한글을 [읽게 됐어요].", "Jetzt kann ich Hangul lesen."],
      ["어떻게 [알게 됐어요]?", "Wie habt ihr euch kennengelernt?", "알게 되다 = kennenlernen, erfahren"],
      ["김치를 [좋아하게 됐어요].", "Inzwischen mag ich Kimchi."],
      ["내일 못 [가게 됐어요].", "Morgen kann ich nun doch nicht kommen."],
      ["매일 [운동하게 됐어요].", "Inzwischen mache ich jeden Tag Sport."]
    ] },

    // ---------- a2-23 Weitergeben, was jemand gesagt hat ----------
    "a2-23n1": { mehr: "Die Endung hängt an der Grundform des wiedergegebenen Satzes. Verb in der Gegenwart: -ㄴ다고 nach Vokal (간다고), -는다고 nach Konsonant (먹는다고); Stämme auf ㄹ verlieren es (산다고). Eigenschaftswort, 있다/없다: Stamm + 다고 (바쁘다고, 있다고). Vergangenheit: -았다고 / -었다고. Zukunft: -(으)ㄹ 거라고. Nomen: (이)라고. Dahinter 해요 (sagt), 했어요 (hat gesagt), 들었어요 (habe gehört), 생각해요 (denke).", verweis: "g-weitersagen", bsp: [
      ["친구가 내일 [온다고 했어요].", "Mein Freund hat gesagt, er kommt morgen.", "Verb nach Vokal → ㄴ다고"],
      ["아이가 김치를 안 [먹는다고 해요].", "Das Kind sagt, es isst kein Kimchi.", "Verb nach Konsonant → 는다고"],
      ["다들 [맛있다고 했어요].", "Alle haben gesagt, es schmeckt.", "있다 → 다고"],
      ["벌써 [도착했다고 해요].", "Er sagt, er ist schon angekommen.", "Vergangenheit → 했다고"],
      ["내일 비가 [올 거라고 했어요].", "Es hieß, morgen regnet es.", "Zukunft → 올 거라고"],
      ["그 사람이 [의사라고 들었어요].", "Ich habe gehört, er ist Arzt.", "Nomen → 라고"]
    ] },
    "a2-23n2": { kv: "stamm", mehr: "Aufforderung weitergeben: Stamm + 라고, nach Konsonant 으라고 (가라고, 먹으라고). Verneint: -지 말라고. Bitte weitergeben: Wenn jemand etwas für sich selbst erbittet, wird aus 주세요 → 달라고 (도와 달라고 했어요 = er hat gebeten, ihm zu helfen). Soll man einer dritten Person etwas geben oder tun, heißt es 주라고 (아이한테 주라고 했어요).", verweis: "g-weitersagen", bsp: [
      ["의사가 술을 [마시지 말라고 했어요].", "Der Arzt hat gesagt, ich soll keinen Alkohol trinken.", "verneint: 지 말라고"],
      ["엄마가 손을 [씻으라고 했어요].", "Mama hat gesagt, du sollst dir die Hände waschen.", "씻 → 으라고"],
      ["직원이 여기에서 [기다리라고 했어요].", "Der Angestellte hat gesagt, wir sollen hier warten."],
      ["친구가 사진을 [보내 달라고 했어요].", "Ein Freund hat gebeten, ihm das Foto zu schicken.", "Bitte für sich selbst → 달라고"],
      ["아이가 물을 [달라고 해요].", "Das Kind möchte Wasser.", "주세요 → 달라고"],
      ["아내가 아이한테 약을 [주라고 했어요].", "Meine Frau hat gesagt, ich soll dem Kind das Medikament geben.", "für eine dritte Person → 주라고"]
    ] },
    "a2-23n3": { mehr: "Frage weitergeben: Stamm + 냐고 (가냐고, 먹냐고, 바쁘냐고); Stämme auf ㄹ verlieren es (사냐고). Vergangenheit: -았냐고. Nomen: (이)냐고 (뭐냐고, 학생이냐고). Dahinter meist 물었어요 oder 물어봤어요 (hat gefragt). Vorschlag weitergeben: Stamm + 자고 (가자고, 먹자고), verneint -지 말자고; dahinter 했어요.", verweis: "g-weitersagen", bsp: [
      ["선생님이 어디 [아프냐고 물었어요].", "Die Lehrerin hat gefragt, wo es wehtut."],
      ["친구가 주말에 뭐 [하냐고 물어봤어요].", "Ein Freund hat gefragt, was ich am Wochenende mache."],
      ["아이가 이게 [뭐냐고 물어요].", "Das Kind fragt, was das ist.", "Nomen → 뭐냐고"],
      ["밥 [먹었냐고 물어봤어요].", "Er hat gefragt, ob ich gegessen habe.", "Vergangenheit → 먹었냐고"],
      ["친구가 주말에 [만나자고 했어요].", "Ein Freund hat vorgeschlagen, uns am Wochenende zu treffen.", "Vorschlag → 자고"],
      ["아내가 오늘은 집에서 [먹자고 했어요].", "Meine Frau hat vorgeschlagen, heute zu Hause zu essen."]
    ] },
    "a2-23n4": { kv: true, mehr: "Nomen + 이라고 nach Konsonant, 라고 nach Vokal; dahinter 해요 (heißt, nennt man), 불러요 (ruft man), 합니다 (bei der Vorstellung). 뭐라고 해요? = „Wie sagt man? Was sagt er?“ Wörtliche Rede gibt man ebenfalls mit 라고 wieder. 뭐라고요? fragt nach, wenn man etwas nicht verstanden hat.", verweis: "g-weitersagen", bsp: [
      ["이건 독일어로 [뭐라고 해요]?", "Wie heißt das auf Deutsch?"],
      ["한국에서는 이걸 [반찬이라고 해요].", "In Korea nennt man das Banchan.", "찬 hat unten ㄴ → 이라고"],
      ["저는 [민호라고 합니다].", "Ich heiße Minho.", "호 endet auf Vokal → 라고"],
      ["이 꽃을 [무궁화라고 해요].", "Diese Blume heißt Mugunghwa."],
      ["[뭐라고요]?", "Wie bitte?", "wenn man etwas nicht verstanden hat"],
      ["방금 [뭐라고 했어요]?", "Was hast du gerade gesagt?"]
    ] },

    // ---------- a2-24 Nachrichten schreiben ----------
    "a2-24n1": { mehr: "Stamm + 잖아요. Vergangenheit: -았잖아요 / -었잖아요. Nomen: 이잖아요 nach Konsonant, 잖아요 nach Vokal. Vertraut: -잖아. Es heißt „doch“, „du weißt ja“: Man erinnert an etwas, das der andere kennt, oder begründet damit etwas. Je nach Ton klingt es freundlich oder vorwurfsvoll. Gegenüber Älteren verwendet man es sparsam.", bsp: [
      ["오늘 [쉬는 날이잖아요].", "Heute ist doch ein freier Tag.", "Nomen nach Konsonant → 이잖아요"],
      ["제가 [말했잖아요].", "Das habe ich doch gesagt.", "Vergangenheit"],
      ["우리 [친구잖아].", "Wir sind doch Freunde.", "vertraut; Nomen nach Vokal → 잖아"],
      ["아직 [어리잖아요].", "Er ist doch noch klein."],
      ["그 집은 [비싸잖아요].", "Das Lokal ist doch teuer."],
      ["내일 [시험 있잖아].", "Du hast doch morgen eine Prüfung.", "vertraut"]
    ] },
    "a2-24n2": { mehr: "Die häufigsten Zusammenziehungen. Mit 것: 이것은 → 이건, 이것이 → 이게, 이것을 → 이걸, 것이에요 → 거예요. Mit Fürwörtern: 저는 → 전, 저를 → 절, 나는 → 난, 너는 → 넌, 여기는 → 여긴. Fragewörter: 무엇 → 뭐, 무엇을 → 뭘. Bindewörter: 그런데 → 근데, 그러면 → 그럼, 그리고 → 그리구 (nur gesprochen). Sonst: 조금 → 좀, 이야기 → 얘기, 아이 → 애, 재미있다 → 재밌다, 마음 → 맘, 처음 → 첨, 다음 → 담. Die meisten sind im Gespräch ganz normal; 맘, 첨 und 담 gehören nur in lockere Nachrichten.", bsp: [
      ["[이건] 뭐예요?", "Was ist das?", "이것은 → 이건"],
      ["[뭘] 먹을까요?", "Was sollen wir essen?", "무엇을 → 뭘"],
      ["[전] 괜찮아요.", "Für mich passt es.", "저는 → 전"],
      ["[근데] 언제 와요?", "Aber wann kommst du?", "그런데 → 근데"],
      ["정말 [재밌어요].", "Das macht wirklich Spaß.", "재미있어요 → 재밌어요"],
      ["[애]가 벌써 자요.", "Das Kind schläft schon.", "아이 → 애"]
    ] },
    "a2-24n3": { mehr: "In Nachrichten unter Vertrauten schreibt man oft nur die Anfangsbuchstaben. ㅋㅋ = Lachen (je mehr ㅋ, desto mehr), ㅎㅎ = leises Lachen, ㅠㅠ oder ㅜㅜ = Weinen, traurig. ㅇㅇ = 응응 (ja), ㄴㄴ = nein, ㅇㅋ = 오케이, ㄱㅅ = 감사 (danke), ㅈㅅ = 죄송 (Entschuldigung), ㅊㅋ = 축하 (Glückwunsch), ㅅㄱ = 수고 (frohes Schaffen). ~ am Satzende macht den Ton weich (네~), ^^ ist ein Lächeln. 넵 und 넹 sind Formen von 네: 넵 klingt eifrig und passt auch bei der Arbeit, 넹 ist verspielt. Gegenüber Älteren, Vorgesetzten und der Lehrerin lässt man die Buchstaben-Abkürzungen weg.", bsp: [
      ["[넵]!", "Jawohl!", "eifriger als 네; auch bei der Arbeit üblich"],
      ["[네네], 알겠어요.", "Ja, ja, verstanden.", "doppelt klingt freundlich"],
      ["[오케이].", "Okay.", "geschrieben oft ㅇㅋ"],
      ["[응응].", "Ja, ja.", "geschrieben oft ㅇㅇ; nur unter Vertrauten"],
      ["[감사합니다]!", "Danke!", "unter Vertrauten oft ㄱㅅ"],
      ["[축하해요]!", "Glückwunsch!", "unter Vertrauten oft ㅊㅋ"]
    ] },
    "a2-24n4": { mehr: "Eine höfliche Nachricht hat drei Teile: Gruß (안녕하세요, … 입니다), Anliegen, Schluss. Nützliche Bausteine: 다름이 아니라 … (es geht um Folgendes), … 때문에 연락드립니다 (ich melde mich wegen …), 확인 부탁드립니다 (bitte um Durchsicht), 답장 부탁드립니다 (bitte um Antwort), 미리 감사합니다 (danke im Voraus). Schluss: 감사합니다, 좋은 하루 보내세요, 수고하세요, 주말 잘 보내세요. Unter einer E-Mail steht Name + 드림 („überreicht von“).", bsp: [
      ["안녕하세요, 선생님. [연락드립니다].", "Guten Tag, Frau Lehrerin. Ich melde mich bei Ihnen."],
      ["늦은 시간에 [죄송합니다].", "Entschuldigen Sie die späte Stunde."],
      ["시간 되실 때 [연락 주세요].", "Melden Sie sich, wenn es Ihnen passt."],
      ["[미리 감사합니다].", "Danke im Voraus."],
      ["주말 잘 [보내세요].", "Schönes Wochenende."],
      ["네, 알겠습니다. [감사합니다].", "Ja, verstanden. Danke."]
    ] }
  }
});
