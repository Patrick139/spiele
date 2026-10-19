// geschichte.js — alle Texte des Spiels an einem Ort (nur Daten und Textfunktionen).
// Sprecher "" = Erzaehler. Reihenfolge der Helden: 0 Garrick, 1 Mara, 2 Anselm.
//
// Die Geschichte in einem Satz: Pfarrer Ambros Wendel war 31 Jahre lang der
// "gute Hirte" von Hollenfurt. Aus dem jungen Idealisten wurde Stueck fuer
// Stueck ein Mann, der alles darf, weil ihn niemand aufhaelt. Dieses Jahr nimmt
// er sich neun Kinder "in den Dienst". Am Ende zeigt er sein wahres Gesicht.
//
// Sprache: so, wie Leute reden. Kurze Saetze, Umgangssprache in Dialogen
// ("hab", "ist", "kein"), keine Amtsdeutsch-Floskeln. Der Erzaehler darf etwas
// ruhiger sein, bleibt aber konkret.
//
// Leitlinie: Taten an Kindern werden NIE gezeigt oder beschrieben. Hart ist das
// Umfeld: Tote, die man "gefunden" hat, Eltern, die man abgefunden hat, Zeugen, denen
// niemand glaubte, eine Kirche, die "besorgt ist und betet". Der Teufel ist
// eine Andeutung (der Mann im grauen Mantel), nie eine Erklaerung.
//
// Textfunktionen am Ende: prologSeiten, dorfSeiten, ambrosDorf, begegnungSeiten,
// kammerVor, kammerSieg, PHASE2, PHASE3. Auswahlseiten tragen "wahl": [{text, antwort, flag, fertig}].

var SPIELTITEL = "DER ZEHNTE";
var UNTERTITEL = "Eine Geschichte aus Hollenfurt";
var PFANDHERR = "Pfarrer Ambros";          // Sprecher des Pfarrers (Name aus Altlast)
var SCHATTEN = "Etwas hinter ihm";         // der, der im grauen Mantel kam
var FINSTER = "Der Pfandherr";             // so nennt sich Ambros in der dritten Stufe

function S(wer, text) { return { wer: wer, text: text }; }

var EBENEN_NAMEN = [
  ["Das Archiv", "Hier hat er angefangen. Er war sechsundzwanzig."],
  ["Das Beinhaus", "Hier hat er gelernt, dass man Dinge wegsperren kann."],
  ["Die Sakristei", "Hier hat er die Tür abgeschlossen."]
];
var KAMMER_NAME = ["Die Kammer der Kerzen", "Neun Gläser. Ein alter Mann wartet."];

var PROLOG = [
  S("", "Hollenfurt liegt da, wo die Straße aus dem Westen auf den Fluss trifft. Siebenundachtzig Einwohner, ein Kloster auf dem Hügel und ein Winter, der dieses Jahr nicht aufhören will."),
  S("", "Einunddreißig Jahre lang war Ambros Wendel hier Pfarrer. Er hat die Kinder getauft und die Alten begraben. Im zweiten Hungerwinter hat er sein eigenes Brot verteilt. Alle nannten ihn den guten Hirten, und das war nicht spöttisch gemeint."),
  S("", "Er hatte immer Ministranten um sich, aus jedem Haus eines. Die Eltern waren stolz darauf. Was in der Sakristei hinter der geschlossenen Tür geschah, dem kleinen Raum neben dem Altar, wollte nie jemand wissen. Manche Kinder wollten irgendwann nicht mehr ministrieren. Dann hieß es: Das gehört sich nicht. Zwei Mädchen sind weggezogen. Margit Hagen, dreizehn, hat man im Frühjahr tot im Fluss gefunden. Ambros hat die Trauerfeier gehalten, und sie war wunderschön. Ihre Mutter ist danach zum Abt gegangen und hat ein Stück Acker am Fluss bekommen. Darüber wurde nie wieder gesprochen."),
  S("", "Jedes Jahr am Martinstag zahlt das Dorf dem Kloster den Zehnten, den zehnten Teil von Wein, Korn und Wachs. So steht es in einem uralten Vertrag. Dieses Jahr stieg Ambros mit dem Vertrag auf die Kanzel. „Der Zehnte gehört dem Herrn“, las er vor, ruhig und freundlich. „Dieses Jahr will der Herr etwas anderes.“ Dann las er neun Namen vor. Es waren Kinder."),
  S("", "Keiner ist aufgestanden. Die Mütter haben sich an den Bänken festgehalten, die Väter auf ihre Hände gestarrt. Er hatte so sanft gesprochen, dass vielen erst auf dem Heimweg klar wurde, was sie da gehört hatten. Und dann haben sie sich gesagt, was sie sich immer gesagt hatten: Das hat schon alles seine Ordnung. Der Bischof, dem man im Herbst geschrieben hatte, war besorgt und hat für alle Beteiligten gebetet. Mehr kam nie.")
];

var HELD_INTRO = [
  [ S("", "Unter den Namen war Elsa. Sieben Jahre alt, zwei Zöpfe und ein Holzpferd, das sie nie aus der Hand gibt."),
    S("", "Garrick war an dem Tag auf dem Markt in Aldrich. Als er zurückkam, standen die Nachbarn am Tor und starrten auf den Boden. Er dachte an die Sonntage, an denen Elsa so still nach Hause gekommen war. Er hatte gedacht, sie wäre bloß müde. Den ganzen Heimweg hat er sich das nicht verziehen."),
    S("", "Die Nachbarn sagten: Das hat schon seine Ordnung. Sie sagten: Der Pfarrer meint es doch gut. Garrick sagte nichts. Er nahm das Schwert vom Nagel, das er vor sieben Jahren aufgehängt hatte, und ging zum Tor."),
    S("", "Er will nicht die Welt retten. Er will, dass Elsa heute Abend ihr Holzpferd wiederhat.") ],
  [ S("", "Unter den Namen war Jonas. Elf Jahre alt, ein Holzmesser im Gürtel und vor nichts auf der Welt Angst."),
    S("", "Mara hat ihn großgezogen, seit die Eltern im Fieberwinter gestorben sind. Sie war auf der Jagd, als der Pfarrer vorlas. Mit einem Hirsch auf den Schultern kam sie heim und fand das Haus leer. Auf dem Tisch standen zwei Teller. Jonas hatte in letzter Zeit nicht mehr vom Ministrieren erzählt. Sie hatte nicht nachgefragt. Diese Frage trägt sie seitdem mit sich herum."),
    S("", "Die Nachbarn sagten: Das hätte jeden treffen können. Sie sagten: Der Pfarrer hat so viel für uns getan. Mara legte den Hirsch vor die Tür des Schmieds, nahm Bogen und Beil und ging zum Tor."),
    S("", "Sie will nicht die Welt retten. Sie will, dass am Tisch wieder jemand zu spät zum Essen kommt.") ],
  [ S("", "Unter den Namen war Lene. Neun Jahre alt, als Baby in einem Korb vor dem Klostertor gefunden."),
    S("", "Bruder Anselm hat sie aufgezogen, mit Ziegenmilch und schlechten Liedern. Er ist der Mesner von Sankt Verena. Dreißig Jahre lang hat er die Kirche aufgesperrt, die Kerzen angezündet und dem Pfarrer die Gewänder gereicht. Dabei hat er Dinge gesehen, die er nicht sehen wollte, und er hat geschwiegen. Den Schlüssel zum untersten Tor trägt er in der Kutte."),
    S("", "Der Abt sagte nur: So steht es im Vertrag. Anselm bat darum, ihn zu sehen. Der Abt sah aus dem Fenster. Da wusste Anselm, dass auch der Abt den Vertrag nie gelesen hatte. Er nahm Stab und Laterne und ging zum Tor."),
    S("", "Er will nicht die Welt retten. Er will, dass Lene ihre schlechten Lieder weitersingt. Und er will nicht mehr schweigen.") ]
];

// ---- Dorfbewohner: gemeinsame Zeilen + je eine Zeile pro Held -------------
var DORF_TEXTE = {
  agnes: {
    alle: [S("Mutter Agnes", "Ich war in der Kirche. Er hat so freundlich gesprochen, das war das Schlimmste daran. Genauso hat er immer gesprochen, wenn er jemanden getröstet hat."),
           S("Mutter Agnes", "Margit Hagen hat mir damals erzählt, was er mit ihr macht. Sie war dreizehn. Ich hab ihr gesagt, sie soll nicht lügen und sich nicht versündigen. Zwei Wochen später haben sie sie aus dem Fluss gezogen. Das werd ich nie los. Er schon. Er hat die Trauerfeier gehalten und gut geschlafen.")],
    held: [[S("Mutter Agnes", "Elsa hat sich noch nach dir umgedreht, Garrick. Ich hab ihr zugenickt, damit sie keine Angst hat. Das verzeih ich mir nicht.")],
           [S("Mutter Agnes", "Jonas hat gefragt, ob du schon vom Jagen zurück bist, Mara. Er wollte dir sagen, wo die Pilze stehen.")],
           [S("Mutter Agnes", "Lene hat gesungen, Bruder. Den ganzen Weg bis zum Tor. Falsch, aber laut.")]]
  },
  schmied: {
    alle: [S("Brandt", "Hör zu, ich sag's nur einmal. Die Toten da unten sind langsam, aber sie halten was aus. Wenn einer ausholt, siehst du einen roten Bogen auf dem Boden. Dann steh nicht mehr da."),
           S("Brandt", "Die Skelette bleiben auf Abstand und schießen. Lauf ihnen nicht geradewegs entgegen. Weich aus, mit der Leertaste. Das kostet Atem, also nicht jedes Mal."),
           S("Brandt", "Meine Schwester ist damals zu mir gekommen. Sie wollte was über ihre Tochter und den Pfarrer erzählen. Ich hab ihr den Mund verboten. Ich hab gesagt: Über einen Mann Gottes redet man so nicht. Sie ist weggezogen, und ich hab nie gefragt, wohin. Im Dorf hab ich erzählt, sie sei durchgedreht. Das hat man mir geglaubt.")],
    held: [[S("Brandt", "Das Schwert liegt gut in der Hand, Garrick. Aber du warst zu lange weg. Schlag dreimal hintereinander, der dritte wirft sie zurück.")],
           [S("Brandt", "Dein Beil ist scharf, Mara. Wirf es, wenn sie dir zu nah kommen. Es trifft auf dem Hinweg und noch einmal auf dem Rückweg.")],
           [S("Brandt", "Ein Mesner mit Stab. Dreißig Jahre hast du neben ihm gestanden, Bruder. So was schleppt man mit sich rum. Ich kenn das.")]]
  },
  ilse: {
    alle: [S("Schwester Ilse", "Ich hab für jedes der neun Kinder in der Kapelle eine Kerze angezündet. Solange sie brennen, sind sie nicht ganz fort."),
           S("Schwester Ilse", "Ich hab mehr gesehen, als ich je gesagt habe. Der Äbtissin hab ich es erzählt. Sie meinte, sie werde dafür beten. Und dann hat man mich in die Küche geschickt, nicht ihn. Beten ist nicht nichts. Aber es war nicht genug. Es war nie genug."),
           S("Schwester Ilse", "Geh nicht hinunter, um ihn zu bekehren. Das hat man all die Jahre mit Güte versucht. Geh hinunter, um sie rauszuholen. Und wenn er dir etwas anbietet, dann frag dich, was er dafür von dir will.")],
    held: [[S("Schwester Ilse", "Elsas Kerze steht ganz vorn, Garrick. Ich hab das Glas jeden Morgen poliert.")],
           [S("Schwester Ilse", "Jonas’ Kerze steht ganz vorn, Mara. Sie ist ein bisschen schief. Er war auch nie gerade.")],
           [S("Schwester Ilse", "Lenes Kerze hab ich selbst gegossen, Anselm. Den Docht hast du mir dafür gegeben.")]]
  },
  tilda: {
    alle: [S("Tilda", "Der Pfarrer hat mir mal ein Bonbon geschenkt. Ich wollte es nicht. Mama hat gesagt, ich bin unhöflich."),
           S("Tilda", "Als er die Namen vorgelesen hat, war es ganz still. Bei jedem Namen sind ein paar Leute aufgestanden, ohne es zu wollen, und haben sich gleich wieder hingesetzt. Als hätten sie was vergessen.")],
    held: [[S("Tilda", "Elsa wollte mir ihr Holzpferd geben. Ich hab nein gesagt, es gehört doch ihr. Bringst du sie zurück?"), S("", "Du nickst. Mehr kannst du nicht versprechen.")],
           [S("Tilda", "Jonas hat gewunken. Er hat so getan, als wär es ein Ausflug. Bringst du ihn zurück?"), S("", "Du nickst. Mehr kannst du nicht versprechen.")],
           [S("Tilda", "Lene hat gesagt, sie singt so lange weiter, bis jemand antwortet. Bringst du sie zurück?"), S("", "Du nickst. Mehr kannst du nicht versprechen.")]]
  }
};

// Das eigene Haus (je Held ein Text) und die Kerze (nach Zahl der Tode).
var HAUS_TEXTE = [
  [S("", "Die Tür steht offen, so wie er sie verlassen hat. Auf der Bank liegt eine Haarschleife. Du steckst sie ein.")],
  [S("", "Zwei Teller stehen auf dem Tisch. Du räumst keinen weg.")],
  [S("", "Die Zelle neben dem Klostertor. An der Wand hängt ein Blatt mit Lenes ersten Buchstaben: L E N E, das zweite E spiegelverkehrt. Du lässt es hängen.")]
];
function kerzenText(h, tode) {
  var p = HELDEN[h].person;
  var zustandText = tode === 0 ? "Das Wachs ist kaum heruntergebrannt." :
    (tode < 3 ? "Das Wachs ist ein Stück kürzer geworden. Du weißt, warum." :
                "Das Wachs ist weit heruntergebrannt. Die Flamme duckt sich, als wüsste sie, wie spät es ist.");
  return [S("", "Eine Kerze in einem kleinen Glas. Am Sockel steht mit Kreide: " + p + ". " + zustandText),
          S("", "Du hältst die Hand um das Glas, bis die Wärme in die Finger steigt. Dann gehst du.")];
}

// ---- Gespraeche mit Ambros: Dorf, Ebene 1, Ebene 2 ---------------------------
// Jede Auswahl hat ein flag (drohen / fragen / schweigen); die haeufigste faerbt
// sein Gespraech im Finale (haltungsZeile).
function wahlDrohen(antwort)   { return { text: "„Ich bring dich um.“", flag: "drohen", antwort: antwort }; }
function wahlFragen(antwort)   { return { text: "„Was hast du ihnen angetan?“", flag: "fragen", antwort: antwort }; }
function wahlSchweigen(antwort) { return { text: "(Du sagst nichts.)", flag: "schweigen", antwort: antwort }; }

// ---- Konfrontation: Ambros wird mit dem konfrontiert, was man in seinen Raeumen gesehen hat ----------
// zustand.beweise: gesehene Gegenstaende (kammer.js). Die Antwort richtet sich nach dem, was man weiss.
var KAMMER_DINGE_OBEN = ["sessel", "tisch", "schrank", "pult", "werktisch", "wand", "riemen", "tuer"];
var KAMMER_DINGE_GEHEIM = ["g_bank", "g_wanne", "g_schrank", "g_kratzer"];
// Im Dungeon zaehlt nur, was in DIESEM Abstieg gesehen wurde (zustand.beweiseAlt = Stand beim Betreten, spiel.js):
// sonst bot Ambros nach einem Tod "Ich war in deiner Kammer" an, obwohl die neue Kammer nie betreten wurde.
// Im Dorf (Gespraech nach dem Laden eines Spielstands) zaehlt alles Gespeicherte.
function beweiseZaehlen() {
  var b = zustand.beweise || {}, alt = zustand.beweiseAlt || {};
  if (zustand.phase !== "dorf") { var neu = {}; for (var k in b) if (b[k] && !alt[k]) neu[k] = true; b = neu; }
  return { oben: KAMMER_DINGE_OBEN.filter(function (k) { return b[k]; }).length,
           geheim: KAMMER_DINGE_GEHEIM.filter(function (k) { return b[k]; }).length, b: b };
}
function konfrontMoeglich() { var n = beweiseZaehlen(); return n.oben + n.geheim > 0; }

function konfrontation(h) {
  var n = beweiseZaehlen(), b = n.b, person = HELDEN[h].person, s = [];
  s.push(S("", "Du hältst ihm entgegen, was du unten gesehen hast. Er hört zu, wie er immer zuhört: den Kopf leicht geneigt, die Hände gefaltet."));
  if (n.oben > 0) s.push(S(PFANDHERR, "Meine Kammer. Ja. Ein alter Mann darf es sich bequem machen. Wer dreißig Jahre für andere da war, darf einen Sessel haben, ein Schälchen Süßes für die Kleinen und eine Tür, die man schließen kann."));
  if (b.pult) s.push(S(PFANDHERR, "Mein Hausbuch. Ich führe Buch über die Gemeinde, über jedes Kind. Das erwartet man von einem Hirten. Wer seine Schafe nicht zählt, verliert sie."));
  if (b.werktisch) s.push(S(PFANDHERR, "Du hast die Zettel gelesen. Die Frage darauf ist nicht von mir. Ich habe sie nur aufgehoben."));
  if (b.schrank) s.push(S(PFANDHERR, "Der Zettel mit dem Namen „" + person + "“. Ich schreibe jedes Jahr die Namen derer auf, für die ich bete. Es ist keine Drohung. Es ist Fürsorge."));
  if (b.riemen || b.wand) s.push(S(PFANDHERR, "Was man zum Schutz baut, sieht für Fremde manchmal anders aus. Manche Kinder laufen weg. Manche tun sich etwas an. Ich habe Wände gepolstert, damit nichts passiert. Wer sieht schon gern, wovor man ein Kind bewahren muss?"));
  if (n.geheim > 0) {
    s.push(S("", "Etwas ändert sich in seinem Gesicht. Nicht viel. Das Lächeln bleibt, aber es sitzt jetzt wie ein Gewand, das man festhält."));
    s.push(S(PFANDHERR, "Du warst hinter der Tür. Berta war immer zu großzügig mit ihren Schlüsseln. Sie wird es nie lernen, und ich habe nie die Kraft gehabt, es ihr zu verbieten. Sie hat ein gutes Herz."));
    if (b.g_kratzer) s.push(S(PFANDHERR, "Margit. Ja, sie hat nach ihrer Mutter gerufen. Und ihre Mutter hat einen Acker bekommen. Ich habe dafür gesorgt, dass wenigstens jemand etwas davon hatte."));
    if (b.g_wanne) s.push(S(PFANDHERR, "Ich habe nie ein Kind schmutzig nach Hause geschickt. Das war das Mindeste."));
    if (b.g_schrank) s.push(S(PFANDHERR, "Die Gewänder sind für Sonntag. Ein Ministrant soll ordentlich aussehen."));
    s.push(S(PFANDHERR, "Du hast gesehen, was ich bin, und du stehst immer noch da und hörst zu. Deshalb hatte ich nie Angst. Wer nach dem Gesehenen noch zuhört, ist am Ende nicht anders als das Dorf."));
    s.push(S("", "Er hat nichts geleugnet und nichts zugegeben. Aber seine Hände sind nicht mehr gefaltet."));
  } else {
    s.push(S(PFANDHERR, "Du siehst, was du sehen willst. Ich sehe, was ich sehe. Mehr ist nicht zwischen uns."));
  }
  return s;
}
// ---- Eskalation: Ambros reizen, bis er es ausspricht; dann kann man ihn angreifen ----------------
// Nur wenn man genug gesehen hat. Jede falsche Antwort beendet das Gespraech, ohne dass etwas passiert.
// Das Gestaendnis ist eindeutig, aber ohne Einzelheiten: nichts wird beschrieben, nur zugegeben.
function kannEskalieren() {
  var n = beweiseZaehlen();
  return !zustand.verfolgung && (n.geheim > 0 || n.oben >= 4);
}
function reizEnde(text) { return { antwort: [S(PFANDHERR, text)] }; }
function reizWahl(text, w) { w.text = text; return w; }

function fluchtSeiten(ort) {
  var anfang = ort === "dorf" ?
    [S("", "Du schlägst zu. Der Hieb trifft ihn an der Schulter, und er geht zu Boden wie ein Sack. Dann steht er wieder, schneller, als ein Mann seines Alters stehen dürfte."),
     S(PFANDHERR, "Nicht hier. Nicht vor dem Dorf. Du wirst mich unten suchen müssen."),
     S("", "Er rennt. Quer über den Platz, den Chorrock hinter sich herziehend, durch das Portal der Kirche. Drinnen fällt der Riegel. Als du die Tür aufbrichst, ist die Kirche leer. Hinter dem Altar steht eine Falltür offen, und von unten kommt der Geruch von Kerzenwachs und Seife.")] :
    [S("", "Du schlägst zu. Der Hieb trifft ihn an der Schulter, und er taumelt rückwärts auf die Treppe."),
     S(PFANDHERR, "Nicht hier. Nicht ohne Zeugen. Komm hinunter, wenn du den Mut hast."),
     S("", "Er stürzt die Stufen hinab. Du folgst bis zur Biegung und hörst eine schwere Tür, Holz auf Stein. Unter dem Archiv liegt die alte Klosterkirche. Er ist hineingegangen und hat den Riegel vorgelegt. Als du ankommst, ist sie leer, und hinter dem Altar klafft ein Schacht im Boden.")];
  return anfang.concat([S("", "Er ist hinabgestiegen. Von jetzt an wird er dich auf jedem Weg erwarten.")]);
}

function reizKette(h, ort) {
  var b = beweiseZaehlen().b, person = HELDEN[h].person;
  var beleg = b.g_bank ? "„Getröstet. Auf der Bank, mit Riemen an den Handgelenken.“" :
              (b.riemen ? "„Getröstet. An Ringen in der Wand, mit Riemen für Kinderhände.“" :
              (b.wand ? "„Getröstet. In einem Raum, in dem niemand schreien hört.“" : "„Getröstet. In einem Keller, den du von außen abschließt.“"));
  var r1 = S(PFANDHERR, "Du kommst mit Zetteln und Möbeln und willst mir sagen, was ich bin. Dann sag es. Ich höre zu. Ich habe immer zugehört.");
  var r2 = S("", "Seine Stimme bleibt sanft. Aber er hat dir nicht in die Augen gesehen, als er das sagte.");
  var r3 = S("", "Er lächelt noch. Aber das Lächeln ist jetzt ein Werkzeug, das er in der Hand hält, keines mehr, das er trägt.");
  var r4 = S("", "Er hat die Hände nicht mehr gefaltet. Er scheint vergessen zu haben, dass er sie dir gegenüber jemals gefaltet hat.");
  var r5 = S("", "In dir ist nichts mehr, das reden will.");
  r1.wahl = [
    reizWahl("„Du hast Kinder angefasst. Sag es.“", { antwort: [
      S(PFANDHERR, "Angefasst. Was für ein hässliches Wort aus einem Mund, der sonst so klug spricht. Ich habe getröstet. Wer weint, wird gehalten. Das ist kein Verbrechen, das ist Seelsorge."), r2] }),
    reizWahl("„Ich glaube dir kein Wort.“", reizEnde("Dann glaub, was du willst. Der Glaube ist das Einzige, was ich keinem nehmen kann.")),
    reizWahl("(Du sagst nichts.)", reizEnde("Du hast mir nichts zu sagen. Dann sind wir fertig."))
  ];
  r2.wahl = [
    reizWahl("„Margit hat es ihrer Mutter gesagt.“", reizEnde("Margit. Ein Kind, das nicht still sein konnte. Gott hat es zu sich genommen, und ich habe sie begraben. Mit allen Ehren.")),
    reizWahl(beleg, { antwort: [
      S(PFANDHERR, "Kinder zappeln, wenn sie Angst haben. Man hält sie fest, damit sie sich nichts tun. Am Ende werden sie ganz still. Das ist die schönste Stille, die es gibt."), r3] }),
    reizWahl("„Vielleicht habe ich mich geirrt.“", reizEnde("Das wäre ein Segen. Für uns beide."))
  ];
  r3.wahl = [
    reizWahl("„Du widerst mich an.“", reizEnde("Das sagen sie später alle. Zuerst sagen sie Danke.")),
    reizWahl("„Was hast du mit " + person + " vor?“", { antwort: [
      S(PFANDHERR, "Mit " + person + "? Nichts, was ich nicht mit jedem getan habe. Ein Zettel am Haken, ein Gewand im Schrank. Ich hatte immer Zeit für alle. Es hätte es gut gehabt bei mir."), r4] }),
    reizWahl("(Du verlässt den Raum.)", { antwort: [S("", "Du gehst. Er sieht dir nach, ohne sich zu bewegen.")] })
  ];
  r4.wahl = [
    reizWahl("„Ich bringe dich nicht um. Ich bringe dich vor Gericht.“", reizEnde("Vor welches? Das Dorf wird dir nicht glauben. Der Abt hat mich gewählt. Der Bischof trinkt meinen Wein.")),
    reizWahl("(Du sagst nichts.)", reizEnde("Du hast die Wahl, wie alle. Schweigen ist die häufigste.")),
    reizWahl("„Sag es ganz. Was du ihnen angetan hast.“", { antwort: [
      S(PFANDHERR, "Ganz. Gut. Du hast dir das Recht dazu verdient."),
      S("", "Er sieht dich zum ersten Mal ganz an. Das Lächeln ist fort. Sein Gesicht ist das eines alten Mannes, der nichts mehr spielen muss."),
      S(PFANDHERR, "Ja. Ich habe sie angefasst. Jedes einzelne. Ich habe sie dort berührt, wo kein Erwachsener ein Kind berühren darf, und danach habe ich sie getröstet, und sie haben sich bei mir bedankt. Über dreißig Jahre. Und jedes Mal hat dieses Dorf den Blick gesenkt."),
      S(PFANDHERR, "Ich habe es nie bereut. Das ist die Wahrheit, die niemand hören will. Nicht einen Tag lang."),
      r5] })
  ];
  r5.wahl = [
    reizWahl("(Du gehst. Jetzt. Bevor du etwas tust, das du nicht zurücknehmen kannst.)", { antwort: [
      S("", "Du gehst. Seine Stimme folgt dir: „Du kommst wieder. Sie kommen alle wieder.“")] }),
    reizWahl("(Du greifst ihn an.)", { antwort: fluchtSeiten(ort), fertig: function () {
      zustand.verfolgung = true; zustand.konfrontiert = (zustand.konfrontiert || 0) + 1; spielSpeichern(); } })
  ];
  return [r1];
}

// Eine Auswahlzeile fuer das Gespraech; folge = Funktion, die nach der Konfrontation weitere Seiten liefert.
// ort ("dorf" | "treppe"): dort kann die Konfrontation zur Eskalation fuehren (nicht im Finale).
function konfrontOption(h, folge, ort) {
  var n = beweiseZaehlen();
  return { text: n.geheim > 0 ? "„Ich war hinter der Tür in deiner Kammer.“" : "„Ich war in deiner Kammer.“", flag: "konfrontieren",
           antwort: konfrontation(h).concat(folge ? folge() : [], ort && kannEskalieren() ? reizKette(h, ort) : []),
           fertig: function () { zustand.konfrontiert = (zustand.konfrontiert || 0) + 1; spielSpeichern(); } };
}

// ---- Die Verfolgung: nach dem Angriff erwartet er dich auf jeder Ebene, tiefer und weniger menschlich ------
function verfolgerVor(n, h) {
  var person = HELDEN[h].person;
  if (n === 1) return [
    S("", "Er steht neben der Treppe. Der Chorrock hängt in Fetzen. Seine Hände sind rot bis zu den Gelenken, und er hat aufgehört, sie zu verstecken."),
    S(PFANDHERR, "Du bist schnell. Das Dorf hat dreißig Jahre gebraucht, um zu fragen, und du hast zwei Tage gebraucht, um zuzuschlagen. Ich habe dich unterschätzt."),
    S(PFANDHERR, "Ich bin kein junger Mann mehr. Aber ich bin auch nicht mehr nur ein Mann.")
  ];
  if (n === 2) return [
    S("", "Auf dieser Ebene riecht es nach Seife. Er steht auf der Treppe, gebeugt, und seine Haut ist grau geworden. Sein linkes Auge leuchtet violett."),
    S(PFANDHERR, "Es tut weh, weißt du. Nicht die Schläge. Das Menschsein. Je tiefer ich gehe, desto weniger muss ich davon tragen."),
    S(PFANDHERR, "Er hat gesagt, ich sei sein Bester. Ich wollte beweisen, dass er recht hat. " + person + " hat es auch gewusst, oder?")
  ];
  return [
    S("", "Auf der letzten Ebene wartet er nicht mehr auf der Treppe. Er hängt über ihr, die Arme zu lang, das Gesicht geöffnet. Aus dem Mund kommt etwas, das einmal seine Stimme war."),
    S(FINSTER, "Ihr habt mich so gut gemacht. Alle. Ich habe nur gehorcht."),
    S(FINSTER, "Komm. Unten sind noch acht Kerzen.")
  ];
}
function verfolgerFlucht(n, h) {
  if (n === 1) return [
    S(PFANDHERR, "Genug. Du hast Kraft. Ich habe Zeit. Unten wartet etwas, das nicht müde wird."),
    S("", "Er springt auf die Treppe und ist fort. Auf den Stufen bleibt ein Streifen Schwarz, der nicht trocknet.")
  ];
  if (n === 2) return [
    S(PFANDHERR, "Weiter. Hinunter. Dort bin ich leichter."),
    S("", "Er fällt die Treppe hinab. Was unten aufschlägt, klingt nicht mehr wie ein Mensch.")
  ];
  return [
    S(FINSTER, "Unten. Die Kammer. Dort bin ich ganz."),
    S("", "Er stürzt in den Schacht unter der Treppe. Von dort kommt ein warmes Licht, wie von Kerzen. Es ist der Weg in die Kammer.")
  ];
}
function kammerVorVerfolgt(h) {
  return [
    S("", "Die letzte Kammer ist rund und still. In Nischen an der Wand brennen Kerzen, jede in einem kleinen Glas. Neun Stück, und unter jeder steht ein Name in Kreide."),
    ENDE_HELD_FUND[h],
    S("", "In der Mitte steht er. Er hat aufgehört, so zu tun, als wäre er ein alter Mann. Das Gewand hängt in Fetzen, und der Schatten hinter ihm ist größer als der Raum."),
    S(FINSTER, "Du hast mich durch jede Ebene gejagt. Ich habe mir das Gesicht vom Leib gerissen, Stück für Stück, und du stehst immer noch da."),
    S(PFANDHERR, "Hol sie dir, wenn du kannst. Ich habe nichts mehr, wofür ich mich schämen müsste.")
  ];
}

var AMBROS_DORF_ERST = [
  S(PFANDHERR, "Grüß Gott, Garrick. Du kommst wegen Elsa, natürlich. Sie hat dein Lachen. Bei mir ist sie gut aufgehoben, so wie viele vor ihr."),
  S(PFANDHERR, "Mara. Du kommst wegen Jonas. Ein kluger Junge, und er hatte so wenig Schutz. Ich hab ihm gegeben, was ihm gefehlt hat."),
  S(PFANDHERR, "Anselm. Dreißig Jahre hast du mir die Gewänder gereicht. Ich hab nie ein Wort darüber verloren, was du gesehen hast. Das war unsere Abmachung, und du hast dich daran gehalten. Warum jetzt nicht mehr?")
];
function ambrosDorf(h) {
  if (zustand.ambrosGesprochen) return [S(PFANDHERR, "Die Tür ist offen. Sie war immer offen. Geh nur hinunter.")];
  zustand.ambrosGesprochen = true;
  var frage = S(PFANDHERR, "Die Tür ist offen, sie war immer offen. Ich hab nie jemanden aufgehalten. Das ist das Schöne an der Güte: Man braucht keine Mauern, wenn alle freiwillig bleiben.");
  frage.wahl = [
    wahlDrohen([S(PFANDHERR, "Das sagen alle. Immer erst, wenn es zu spät ist. Wut ist das, was übrig bleibt, wenn man vorher nicht hinsehen wollte.")]),
    wahlFragen([S(PFANDHERR, "Ich hab zugehört. Ich hab getröstet. Was ich getan habe, hat nie jemand verboten. Frag den Abt. Frag den Bischof. Beide haben mir ausrichten lassen, sie seien besorgt.")]),
    wahlSchweigen([S(PFANDHERR, "Das ist klug. Schweigen kann dieses Dorf am besten. Ich hab es nur genutzt.")])
  ];
  if (konfrontMoeglich()) frage.wahl.push(konfrontOption(h, null, "dorf"));
  return [AMBROS_DORF_ERST[h], frage];
}

// Begegnung an der Treppe der Ebene 1 und 2: er steht dort, ohne dort zu sein.
function begegnungSeiten(nr, h) {
  if (h === undefined) h = HELD;
  var s;
  if (nr === 1) {
    s = [S("", "Er steht neben der Treppe, die Hände gefaltet. Der Staub unter seinen Füßen rührt sich nicht. Er ist nicht wirklich hier. Er ist nur auch nicht weg."),
         S(PFANDHERR, "Du liest mein Buch. Gut, das hab ich für jemanden wie dich geschrieben. Ich hab nie etwas versteckt. Ich hab nur gewartet, bis es keinen mehr kümmert."),
         S(PFANDHERR, "Margit Hagen war dreizehn. Im Fluss hat man sie gefunden. Ich hab die Trauerfeier gehalten und sehr schön gesprochen. Das ganze Dorf hat geweint und mir die Hand gedrückt. Ich hab ihr ein Grab auf dem Friedhof besorgt. Das macht nicht jeder für ein Mädchen, das sich das Leben genommen hat.")];
    s[2].wahl = [
      { text: "„Du hast sie umgebracht.“", flag: "drohen", antwort: [S(PFANDHERR, "Der Fluss hat sie genommen. Und die Nachbarn, die ihr nicht zugehört haben. Ich war immer da und hab zugehört.")] },
      { text: "„Was war sie dir?“", flag: "fragen", antwort: [S(PFANDHERR, "Ein Kind, das mich gebraucht hat. Das begreift ihr nie: Sie haben mich gebraucht. Wer hat ihnen denn sonst zugehört? Ihr jedenfalls nicht.")] },
      wahlSchweigen([S(PFANDHERR, "Du bist wie die anderen. Du schaust auf deine Hände. Ist nicht schlimm. Mir hat das dreißig Jahre gut gedient.")])];
    if (konfrontMoeglich()) s[2].wahl.push(konfrontOption(h, null, "treppe"));
  } else {
    s = [S("", "Wieder steht er neben der Treppe. Seine linke Hand ist schwarz bis zum Gelenk. Er versteckt sie nicht."),
         S(PFANDHERR, "Fünfzehn Jahre hab ich darauf gewartet, dass jemand kommt. Ein Vater, eine Mutter, ein Richter, ein Bischof. Der Bischof kam einmal. Er hat meinen Wein getrunken, die Kerzen gelobt und mich auf meinem Posten gelassen. Entfernt wird nur, wer unbequem ist."),
         S(PFANDHERR, "Der Mann im grauen Mantel hat mir nie etwas befohlen. Er hat mir nur nichts verboten. Verstehst du den Unterschied? Er hat gesehen, was ich tue, und gelächelt. Das hat gereicht. Wer lächelt, erlaubt.")];
    s[2].wahl = [
      { text: "„Du bist ein Teufel.“", flag: "drohen", antwort: [S(PFANDHERR, "Ich war Pfarrer. Das ist schlimmer, weil man mir geglaubt hat. Der Teufel braucht Verträge. Ich hab nur Sonntage gebraucht.")] },
      { text: "„Du hättest aufhören können.“", flag: "fragen", antwort: [S(PFANDHERR, "Ja. Jede Nacht. Ein Wort zu irgendwem hätte gereicht. Zweitausend Nächte hab ich darauf gewartet, dass jemand fragt. Keiner hat gefragt. Ihr habt mich sehr geliebt. Das war das Problem.")] },
      wahlSchweigen([S(PFANDHERR, "Auch gut. Wer schweigt, hat mir immer am meisten geholfen.")])];
    if (konfrontMoeglich()) s[2].wahl.push(konfrontOption(h, null, "treppe"));
  }
  return s;
}

// ---- Das Zauberbuch des Archivwaechters (Ebene 1) ---------------------------------
var ZAUBERBUCH = [
  S("", "Der Wächter fällt, und aus seinem zerrissenen Gewand rutscht ein Buch. Schwarzes Leder, mit einem Band aus Haar zugebunden. Es ist warm, als hätte es gerade noch jemand in der Hand gehabt."),
  S("", "Du schlägst es auf. Die Schrift bewegt sich. Ein einziges Wort bleibt stehen: NOVA."),
  S("Am Rand", "„Nimm, was du brauchst. Es kostet nichts.“ Die Schrift ist ordentlich, fast liebevoll. Du weißt, dass der Satz nicht stimmt."),
  S("", "Du brauchst keine Anleitung. Du sammelst, was in dir ist, und lässt es los, nach allen Seiten, wie einen Ring auf dem Wasser. Neuer Zauber: Nova. Mit dem Mausrad oder den Tasten 1 und 2 wechselst du, was die rechte Maustaste tut: Wurfwaffe oder Nova. Die Nova kostet Mana.")
];
// ---- Berta, die Haushaelterin: vollkommen auf seiner Seite. Der Ersatzschluessel gibt es nur durch ----
// drei richtige Antworten hintereinander. Eine falsche beendet das Gespraech; man faengt von vorn an.
var BERTA = "Berta, die Haushälterin";
function bertaFehler(text) {                       // falsche Antwort: sie schliesst sich ab
  return { antwort: [S(BERTA, text)], fertig: function () { zustand.bertaVersuche = (zustand.bertaVersuche || 0) + 1; } };
}
function bertaWahl(text, w) { w.text = text; return w; }
function bertaGespraech(h) {
  if (zustand.schluessel) return [S(BERTA, "Du hast ihn. Bring ihn zurück, wenn du fertig bist. Und sag Hochwürden nichts davon, er soll sich nicht kränken.")];
  var kopf = zustand.bertaVersuche > 0 ?
    [S(BERTA, "Du schon wieder. Wer mir mit Vorwürfen oder Forderungen kommt, bekommt keinen Tee. Wer zuhört, vielleicht mehr.")] :
    [S("", "Berta Amsel führt Ambros seit achtundzwanzig Jahren das Haus. An ihrem Gürtel klimpert ein schwerer Schlüsselbund. Sie lächelt, als hätte sie dich schon erwartet."),
     S(BERTA, "Hochwürden hat gesagt, du kommst. Setz dich, der Tee ist heiß. Ich hab ihm versprochen, dass ich nett zu dir bin.")];
  var frage1 = S(BERTA, "Also, was führt dich zu mir?");
  var frage2 = S(BERTA, "Sag schon. Was willst du von mir wissen?");
  var frage3 = S(BERTA, "Warum fragst du? Was willst du dort unten?");
  frage1.wahl = [
    bertaWahl("„Ihr wisst, was er mit den Kindern macht.“", bertaFehler("Was für ein Ton. Ich hab dich für anständig gehalten. Geh. Hochwürden hat mir beigebracht, dass man mit Verleumdern nicht redet. Man betet für sie.")),
    bertaWahl("„Ihr haltet viel von ihm.“", { antwort: [
      S(BERTA, "Viel? Ich bin mit vierzehn in dieses Haus gekommen. Meine Mutter war tot, mein Vater hat getrunken. Hochwürden war damals noch jung. Er hat mich aufgenommen wie ein eigenes Kind. Ich war die Erste, die ihm helfen durfte. Das war eine Ehre."),
      S(BERTA, "Er hat mir alles beigebracht. Wie man eine Wanne schrubbt, bis kein Fleck bleibt. Wie man ein Bett macht, dass niemand etwas merkt. Wie man still ist. Ich bin sehr gut darin."),
      frage2 ] }),
    bertaWahl("„Ich brauche den Schlüssel zu seinem Keller.“", bertaFehler("Schlüssel gibt es für die, die man kennt. Dich kenne ich nicht. Geh, bevor ich Hochwürden rufe."))
  ];
  frage2.wahl = [
    bertaWahl("„Was war es, das du ihm abgenommen hast?“", { antwort: [
      S(BERTA, "Alles Unangenehme. Wenn etwas aufgeräumt werden muss, dann bin ich da. Er soll sich nicht mit dem Schmutz der Welt beschmutzen. Er hat so viel Gutes zu tun."),
      S(BERTA, "Die Schlüssel sind mein Ding, Kind. Zum Keller, zur Kammer unten, zu allem. Seiner ist einer. Ich habe einen Ersatz, falls seiner verloren geht. Den hab ich noch nie jemandem gegeben."),
      frage3 ] }),
    bertaWahl("„Er hat dich benutzt, Berta.“", bertaFehler("Benutzt. Ich war nie so nützlich wie in diesem Haus. Er hat mir ein Dach gegeben und einen Namen. Du gibst mir ein hässliches Wort. Geh.")),
    bertaWahl("„Er ist ein Heiliger.“", bertaFehler("Das sagst du, weil du es hören willst. Ich hab dreißig Jahre Leute so reden hören. Wer ihn wirklich kennt, sagt nicht Heiliger. Der sagt Hochwürden. Geh."))
  ];
  frage3.wahl = [
    bertaWahl("„Mein Kind ist dort. Ich will es zurück.“", bertaFehler("Alle Eltern sagen das. Hochwürden hat für jedes Kind eine Erklärung, und sie stimmt immer. Es ist gut aufgehoben.")),
    bertaWahl("„Ich gebe dir Geld dafür.“", bertaFehler("Geld. Du hast mir nicht zugehört. Dann hast du auch sonst nichts verstanden. Geh.")),
    bertaWahl("„Ich will verstehen, was er für die Kinder tut. Zeig es mir.“", { antwort: [
      S(BERTA, "Du willst es verstehen. Das ist selten. Die meisten wollen nur schreien."),
      S("", "Sie nimmt einen kleinen Schlüssel vom Bund. Dunkles Eisen, glatt gegriffen. Ihre Finger zittern nicht."),
      S(BERTA, "Er wird sich freuen, dass es jemand sieht. Aber lass es ihn nicht merken. Es ist nicht für ihn. Es ist für das Haus."),
      S("", "Du hast den Ersatzschlüssel. In seiner Privatkammer im Archiv gibt es eine Tür, die noch zu ist.")
    ], fertig: function () { zustand.schluessel = true; spielSpeichern(); } })
  ];
  return kopf.concat([frage1]);
}

var WAECHTER_NAME = "Der Archivwächter";

// ---- Fundstuecke: Seiten aus dem Pfarrbuch des Ambros Wendel ----------------
// Zwei je Ebene, in Zeitfolge: wer tiefer geht, liest, wie aus ihm das wurde.
var FUNDE = [
  [ [S("Pfarrbuch, erstes Jahr", "„Heute den alten Archivkeller aufgeräumt. Die Brüder vor mir haben jahrhundertelang nichts weggeworfen. Vierzehn Kinder getauft, drei Alte begraben. Ich bin sechsundzwanzig und glaube zum ersten Mal wirklich, dass ich am richtigen Ort bin.“")],
    [S("Pfarrbuch, siebtes Jahr", "„Im untersten Gewölbe, hinter einem Fass, ein Vertrag, so alt, dass das Pergament knackt. Der erste Abt hat unterschrieben. Sein Gegenüber nennt sich nur ‚der Pfandherr‘. Der Zehnte soll ihm gehören, ‚was immer er darunter zählt‘. Abt Severin hat den Vertrag nie gelesen, und sonst auch keiner. Ich hab ihn wieder zugedeckt. Ich weiß nicht, warum ich ihn nicht verbrannt habe.“")] ],
  [ [S("Pfarrbuch, neuntes Jahr", "„Der zweite Hungerwinter. Die Speicher waren leer. In der dritten Nacht bin ich zum Vertrag hinuntergegangen wie ein Kind, das nach der Mutter ruft. Ich habe nichts gesagt. Am Morgen stand ein Mann in der Sakristei, grauer Mantel, warme Hände. Er hat nach dem Wetter gefragt. Verlangt hat er nichts. Am Dienstag kam Korn aus Aldrich, das keiner bestellt hatte. Ich habe dem Dorf gesagt, Gott habe es geschickt. Fast hab ich es selbst geglaubt.“")],
    [S("Pfarrbuch, sechzehntes Jahr", "„Margit Hagen ist tot. Man hat sie im Fluss gefunden. Ich habe die Trauerfeier gehalten und echte Tränen geweint, es war meine beste Predigt. Danach war ihre Mutter beim Abt, meinetwegen. Ich habe ihr das Stück Acker am Fluss geschenkt. Der Abt war verständnisvoll: ‚Das bleibt zwischen uns und dem Herrn.‘ Es war so leicht. Das hat mich mehr erschreckt als alles andere. In der letzten Bank saß der Mann im grauen Mantel. Er hat genickt.“")] ],
  [ [S("Pfarrbuch, vierundzwanzigstes Jahr", "„Abt Severin ist tot. Der Rat hat mich einstimmig zum Verwalter des Klosters gewählt, keiner sonst wollte es. Die Kinder kommen gern. Ich bin der Einzige in ihrem Leben, der sie nie geschlagen hat. Ich hab aufgehört, mich zu fragen, ob das reicht. Man kann nicht jeden Tag vor Gericht stehen, wenn man jeden Tag Gutes tut. Die Rechnung geht auf.“")],
    [S("Pfarrbuch, einunddreißigstes Jahr", "„Es wird eng. In Aldrich fangen sie an zu reden. Ich habe den Vertrag zum ersten Mal ganz gelesen. Der Zehnte gehört dem Herrn, und in diesem Haus bin ich der Herr. Wenn der Vertrag mir die Kinder gibt, nimmt sie mir keiner weg. Es ist alles erlaubt, schwarz auf weiß. Man muss nur lange genug gut gewesen sein, dann glaubt dir jeder alles. Der Mann im Mantel stand heute wieder ganz hinten. Er sah aus wie einer, der ein Experiment beendet. Er hat gelächelt.“")] ]
];

// ---- Das Finale: Kammer der Kerzen -----------------------------------------
var ENDE_ANFANG = [
  S("", "Die letzte Kammer ist rund und still. In Nischen an der Wand brennen Kerzen, jede in einem kleinen Glas. Neun Stück, und unter jeder steht ein Name in Kreide. Davor steht ein alter Mann im weißen Gewand, die Hände gefaltet, als käme er gerade aus der Sonntagsmesse. Hinter ihm ragt die Wand höher und dunkler auf, als sie sein dürfte. Du merkst: Das da ist kein Schatten.")
];
var ENDE_HELD_FUND = [
  S("", "Du erkennst die Kerze, noch bevor du den Namen liest. Elsa. Daneben auf dem Boden steht das Holzpferd."),
  S("", "Du erkennst die Kerze, noch bevor du den Namen liest. Jonas. Das Glas steht ein bisschen schief. Er war nie gerade."),
  S("", "Du erkennst die Kerze, noch bevor du den Namen liest. Lene. Du meinst, in der Flamme eine Melodie zu hören, schlecht gesungen und laut.")
];
var ENDE_HELD_AUSGANG = [
  S("", "Draußen hängt der Morgen im Nebel. Elsa sagt nichts. Sie nimmt deine Hand und hält sie so fest, dass es wehtut. Das Holzpferd hat sie im Arm. Du lässt sie festhalten, so lange sie will."),
  S("", "Draußen hängt der Morgen im Nebel. Jonas dreht sich nicht um. Er fragt nur, ob er deine Hand halten darf, so wie früher. Du sagst ja. Auf dem Heimweg isst er nichts, aber er bleibt dicht bei dir."),
  S("", "Draußen hängt der Morgen im Nebel. Lene summt nicht. Anselm legt ihr seine Kutte um die Schultern und setzt sich neben sie auf den Stein vor dem Tor. Er wartet, bis sie wieder anfängt. Es dauert lange.")
];
var HELD_NAME = ["Garrick", "Mara", "Bruder Anselm"];

// Ambros greift auf, was du ihm in den Gespraechen gezeigt hast.
function haltungsZeile() {
  var n = { drohen: 0, fragen: 0, schweigen: 0, konfrontieren: 0 }, w = zustand.wahlen || [], best = "fragen", i;
  for (i = 0; i < w.length; i++) n[w[i]]++;
  for (var k in n) if (n[k] > n[best]) best = k;
  if (best === "drohen") return S(PFANDHERR, "Du hast mir bei jeder Begegnung gedroht. Das ist ehrlich. Es kommt nur dreißig Jahre zu spät, wie bei allen.");
  if (best === "konfrontieren") return S(PFANDHERR, "Du hast mir nicht gedroht und nicht gefragt. Du hast mir gezeigt, was du gefunden hast. Das tut mehr weh als beides, wenigstens kurz.");
  if (best === "schweigen") return S(PFANDHERR, "Du hast bei jeder Begegnung geschwiegen. Du gehörst zu uns. Das ist keine Beleidigung, nur eine Feststellung.");
  return S(PFANDHERR, "Du fragst viel. Das ist selten. Zweitausend Nächte hab ich auf jemanden gewartet, der fragt. Du kommst zu spät.");
}

// Der Handel: Kind gegen Schweigen. Das Ende "Schweigen" fuehrt zurueck zum Titel.
function kammerSchweigen(h) {
  var ausgang = [
    "Elsa spricht nie wieder davon. Du fragst nicht. Im nächsten Frühjahr stehen zwei neue Ministranten am Altar. Du siehst sie jeden Sonntag. Du hast gelernt, auf deine Hände zu schauen.",
    "Jonas spricht nie wieder davon. Du fragst nicht. Du bringst ihm das Jagen bei, ihr redet über alles, nur nicht darüber. Im Frühjahr stehen zwei neue Ministranten am Altar.",
    "Lene singt wieder, leiser. Anselm reicht dem Pfarrer weiterhin die Gewänder, wie früher. Er hat sein Wort gegeben, und er hält es. Es ist das Schlimmste, was er je getan hat."
  ];
  return [S(PFANDHERR, "Gut. Du bist vernünftiger als die meisten. Nimm dein Kind mit. Es kann nichts erzählen, was ihm einer glauben würde. Das Dorf hat diesen Handel immer gemacht. Es hat nur nie gewusst, dass es ihn macht."),
          S("", "Du hebst das Glas auf. Hinter dir brennen acht Kerzen. Du hörst nicht hin."),
          S("", ausgang[h]),
          S("", "Das ist ein Ende. Es ist nicht das einzige.")];
}

function angebotSeite(h, nochmal) {
  var angebot = S(PFANDHERR, nochmal ?
    "Also. Nimm dein Kind und geh, oder hol es dir. Jetzt weißt du, was dich erwartet." :
    "Ich mach dir dasselbe Angebot wie jedem. Nimm dein Kind und geh. Sprich nie darüber. Das Dorf wird dir recht geben, nicht mir. Es hat sich immer fürs Schweigen entschieden. Oder du holst es dir. Dann musst du an mir vorbei.");
  angebot.wahl = [
    { text: "Ich nehme mein Kind mit. Und ich schweige.", antwort: kammerSchweigen(h), fertig: insTitel },
    { text: "Gib mir mein Kind. Jetzt.", antwort: [S(PFANDHERR, "Dann zeig mir, was ein Mensch tut, der nichts mehr zu verlieren hat. Ich hab das oft gesehen. Es dauert nie lange.")] }
  ];
  if (!nochmal && konfrontMoeglich()) angebot.wahl.push(konfrontOption(h, function () { return [angebotSeite(h, true)]; }));
  return angebot;
}

function kammerVor(h) {
  var n = beweiseZaehlen();
  var wissen = n.geheim > 0 && !(zustand.konfrontiert > 0) ?
    [S("", "Er sieht dich an und weiß, wo du gewesen bist. Er sagt nichts darüber.")] : [];
  return ENDE_ANFANG.concat([ENDE_HELD_FUND[h]], [
    S(PFANDHERR, "Grüß Gott. Du bist früher gekommen, als ich dachte. Aber nicht zu spät. Bei mir ist man nie zu spät.")],
    wissen, [
    haltungsZeile(),
    S(PFANDHERR, "Ich weiß, was du denkst. Das hab ich von vielen Eltern gehört, im Beichtstuhl, danach, nie davor. Ich hab mir für jeden Zeit genommen. Keinem ist etwas passiert, was er nicht überlebt hätte. Den meisten."),
    S(PFANDHERR, "Einunddreißig Jahre war ich der beste Mann, den dieses Dorf je hatte. Wer so lange gut war, hat sich etwas verdient. Das siehst du ein. Das haben alle eingesehen."),
    S(SCHATTEN, "Er war mein Bester. Ich wollte sehen, wie weit ein guter Mann geht, wenn ihn niemand aufhält. Es hat ihn niemand aufgehalten. Das war nicht mein Verdienst."),
    angebotSeite(h, false)]);
}

// Stufenwechsel im Kampf (laufen als Textbox ueber dem Spielbild).
var PHASE2 = [
  S("", "Er lächelt noch. Aber unter dem Lächeln bewegt sich etwas, das nicht lächelt. Das weiße Gewand reißt vom Hals bis zum Saum auf, und darunter ist kein Fleisch."),
  S(PFANDHERR, "Du denkst, ich verstecke mich. Hab ich nie. Ich habe das Gesicht getragen, das ihr mir gegeben habt. Ihr wolltet einen Heiligen. Ich war so freundlich, einer zu sein.")
];
var PHASE3 = [
  S("", "Die Haut löst sich. Was darunter war, hat zu lange gewartet. Der Raum wird enger, die Kerzen ducken sich."),
  S(FINSTER, "Einunddreißig Jahre Gottesdienst, und nicht ein einziger Zeuge. Das ist mein Verdienst. Nein, euer Werk. Das Werk von euch allen, die ihr weggesehen habt.")
];

function kammerSieg(h) {
  var antwort = [
    "Du hast sie nicht geliebt. Du hast sie gebraucht.",
    "Das Wort passt nicht zu dem, was du getan hast.",
    "Dem Satz hab ich dreißig Jahre lang nicht widersprochen. Jetzt tu ich's."
  ];
  return [
    S("", "Er sinkt auf die Knie. Der Schatten zieht sich von ihm zurück wie Wasser vom Strand. Übrig bleibt ein alter Mann im zerrissenen weißen Gewand."),
    S(PFANDHERR, "Ich hab sie doch geliebt."),
    S(HELD_NAME[h], antwort[h]),
    S(SCHATTEN, "Er war mein Bester. Und er war nicht besser als die anderen. Das ist der Teil, der mich unterhält."),
    S(SCHATTEN, "Nimm dein Kind. Der Vertrag hält nicht ihn fest, sondern das Dorf. Die acht anderen Kerzen gehen erst aus, wenn Hollenfurt laut ausspricht, was geschehen ist, mit allen Namen. Dafür gibt es kein Schwert."),
    ENDE_HELD_AUSGANG[h],
    S("", "Du hast ihn besiegt. Das ändert nichts an dem, was geschehen ist, und nichts für die, die schon fort sind. Margit Hagen bleibt tot. Hinter dir brennen acht Kerzen, und sie brennen, bis Hollenfurt aufhört zu schweigen. Morgen früh läutet die Glocke. Aber heute Abend sitzt in einem Haus wieder ein Kind am Tisch, und jemand glaubt ihm.")
  ];
}

function prologSeiten(h) { return PROLOG.concat(HELD_INTRO[h]); }
function dorfSeiten(id, h) { var t = DORF_TEXTE[id]; return t.alle.concat(t.held[h]); }
