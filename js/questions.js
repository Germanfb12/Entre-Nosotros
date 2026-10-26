/*
  Catálogo original de "Entre Nosotros".
  ------------------------------------------------------------
  Formato de cada pregunta: [id, categoría, intensidad, texto]
    - id: identificador único y permanente. NUNCA reutilices ni cambies un id
      existente: el historial de cada jugador se guarda por id.
    - intensidad: 1 = Suave, 2 = Profundo, 3 = Sin filtros
    - Género: {masculino|femenino} se adapta a quien RESPONDE la carta.
              {o:masculino|femenino} se adapta a la OTRA persona.
  Para agregar preguntas al catálogo, sumalas al final con un id nuevo
  (por ejemplo "n200", "n201"...) y subí el número de versión en sw.js.
*/
(function (root) {
  var CATEGORIES = [
    { id: 'infancia',    name: 'Infancia y pasado',          short: 'Infancia',     color: '#C9A27E', icon: 'hourglass' },
    { id: 'personalidad',name: 'Personalidad y emociones',   short: 'Emociones',    color: '#B98A9A', icon: 'wave' },
    { id: 'amor',        name: 'Amor y relación',            short: 'Amor',         color: '#B8495A', icon: 'rings' },
    { id: 'intimidad',   name: 'Intimidad y sexualidad',     short: 'Intimidad',    color: '#9A2A3C', icon: 'flame' },
    { id: 'futuro',      name: 'Futuro y proyectos',         short: 'Futuro',       color: '#8FA39A', icon: 'compass' },
    { id: 'conflictos',  name: 'Conflictos y comunicación',  short: 'Comunicación', color: '#C27E55', icon: 'bubbles' },
    { id: 'valores',     name: 'Valores y creencias',        short: 'Valores',      color: '#A89770', icon: 'anchor' },
    { id: 'diversion',   name: 'Diversión y complicidad',    short: 'Diversión',    color: '#D6B46C', icon: 'dice' },
    { id: 'profundas',   name: 'Preguntas profundas',        short: 'Profundas',    color: '#7D8DAE', icon: 'moon' },
    { id: 'deseos',      name: 'Deseos y secretos',          short: 'Secretos',     color: '#9A6788', icon: 'key' }
  ];

  var LEVELS = [
    { id: 1, name: 'Suave',       desc: 'Para entrar en confianza' },
    { id: 2, name: 'Profundo',    desc: 'Personal y emocional' },
    { id: 3, name: 'Sin filtros', desc: 'Directo e íntimo, sin presión' }
  ];

  var Q = [
    // ── Tus 60 cartas originales (Entre Nosotros) ──────────────────────
    ['p01','amor',1,'¿En qué momento empezaste a sentir algo especial por mí?'],
    ['p02','amor',1,'¿Qué es lo que más te gusta de nuestra relación?'],
    ['p03','diversion',1,'¿Qué recuerdo nuestro te hace sonreír?'],
    ['p04','amor',1,'¿Qué te gustaría que hiciéramos más seguido?'],
    ['p05','amor',2,'¿Cuándo te sentiste más {querido|querida} por mí?'],
    ['p06','amor',1,'¿Qué detalle mío te enamora en silencio?'],
    ['p07','amor',2,'¿Qué aprendiste sobre el amor estando conmigo?'],
    ['p08','deseos',2,'¿Qué parte de tu vida querés compartir más conmigo?'],
    ['p09','amor',1,'¿Qué te gustaría que nunca cambiara entre nosotros?'],
    ['p10','diversion',1,'¿Qué canción te recuerda a mí?'],
    ['p11','personalidad',1,'¿Qué cosa simple te hace sentir cerca de mí?'],
    ['p12','conflictos',2,'¿Qué te gustaría escuchar de mí más seguido?'],
    ['p13','personalidad',2,'¿Qué miedo te cuesta admitir en una relación?'],
    ['p14','conflictos',3,'¿Alguna vez sentiste celos y no me lo dijiste?'],
    ['p15','deseos',3,'¿Qué pregunta te da vergüenza hacerme?'],
    ['p16','conflictos',2,'¿Qué necesitás cuando discutimos?'],
    ['p17','deseos',3,'¿Hay algo que todavía no te animaste a contarme?'],
    ['p18','personalidad',3,'¿Qué actitud mía te hace sentir {inseguro|insegura}?'],
    ['p19','valores',2,'¿Qué significa para vos confiar de verdad?'],
    ['p20','personalidad',2,'¿Qué te gustaría que yo entendiera mejor de vos?'],
    ['p21','conflictos',2,'¿Qué cosa te cuesta pedir en una relación?'],
    ['p22','diversion',1,'¿Cuál fue una primera impresión equivocada que tuviste de mí?'],
    ['p23','valores',2,'¿Qué límite personal querés que siempre respete?'],
    ['p24','conflictos',3,'¿Qué conversación importante venimos postergando?'],
    ['p25','intimidad',1,'¿Qué fue lo primero que te resultó atractivo de mí?'],
    ['p26','intimidad',1,'¿Qué mirada mía te vuelve {loco|loca}?'],
    ['p27','intimidad',1,'¿Cuál de nuestros besos recordás más?'],
    ['p28','intimidad',1,'¿Qué ropa mía te encanta verme puesta?'],
    ['p29','intimidad',2,'¿Qué gesto cotidiano mío te parece sensual?'],
    ['p30','intimidad',3,'¿Qué parte de mi cuerpo te gusta acariciar?'],
    ['p31','diversion',1,'¿Cuál sería tu cita ideal para seducirme?'],
    ['p32','intimidad',1,'¿Qué tipo de beso te gusta más?'],
    ['p33','diversion',1,'¿Qué te gustaría que hiciera para sorprenderte?'],
    ['p34','intimidad',2,'¿En qué momento sentís más química entre nosotros?'],
    ['p35','intimidad',3,'¿Qué palabra o frase mía te enciende?'],
    ['p36','amor',1,'¿Qué te gusta que haga cuando estamos abrazados?'],
    ['p37','deseos',3,'¿Qué fantasía te gustaría contarme sin sentir vergüenza?'],
    ['p38','intimidad',3,'¿Qué te gustaría probar juntos, si ambos tenemos ganas?'],
    ['p39','intimidad',2,'¿Preferís una noche romántica o una espontánea? ¿Por qué?'],
    ['p40','intimidad',3,'¿Qué es lo que más te excita de nuestra complicidad?'],
    ['p41','deseos',3,'¿Qué te gustaría que te susurrara al oído?'],
    ['p42','intimidad',3,'¿Qué tipo de caricias disfrutás más?'],
    ['p43','intimidad',2,'¿Qué ambiente te resulta más sensual?'],
    ['p44','deseos',3,'¿Qué te gustaría que yo tomara la iniciativa para hacer?'],
    ['p45','deseos',3,'¿Qué te da curiosidad explorar conmigo?'],
    ['p46','intimidad',3,'¿Cuál fue nuestro momento más apasionado para vos?'],
    ['p47','intimidad',3,'¿Qué hace que te sientas realmente {deseado|deseada}?'],
    ['p48','intimidad',3,'¿Qué te gustaría repetir de una noche juntos?'],
    ['p49','futuro',1,'¿Cómo imaginás una escapada perfecta conmigo?'],
    ['p50','futuro',1,'¿Qué aventura soñás vivir juntos?'],
    ['p51','futuro',1,'¿Qué costumbre de pareja te gustaría crear?'],
    ['p52','futuro',2,'¿Qué te gustaría que recordemos dentro de diez años?'],
    ['p53','amor',1,'¿Qué creés que nos hace un buen equipo?'],
    ['p54','valores',2,'¿Qué promesa realista podríamos hacernos hoy?'],
    ['p55','amor',2,'¿Qué es lo que más valorás de mi forma de amar?'],
    ['p56','futuro',1,'¿Qué te gustaría aprender juntos?'],
    ['p57','conflictos',2,'¿Qué momento difícil nos enseñó algo?'],
    ['p58','valores',2,'¿Qué significa para vos elegirnos cada día?'],
    ['p59','diversion',1,'¿Qué plan espontáneo harías conmigo mañana?'],
    ['p60','diversion',1,'¿Qué pregunta querés hacerme ahora mismo?'],

    // ── Ejemplos del brief ─────────────────────────────────────────────
    ['b01','infancia',2,'¿Qué experiencia de tu infancia creés que más influyó en la persona que sos hoy?'],
    ['b02','futuro',2,'¿Qué miedo tenés sobre el futuro que pocas veces expresás?'],
    ['b03','personalidad',2,'¿Qué situación te hace sentir más vulnerable conmigo?'],
    ['b04','personalidad',2,'¿Qué parte de tu personalidad sentís que la gente suele interpretar mal?'],
    ['b05','amor',2,'¿Qué necesitás de mí cuando estás pasando por un mal momento?'],
    ['b06','deseos',2,'¿Hay algo que siempre quisiste preguntarme y nunca encontraste el momento?'],
    ['b07','valores',2,'¿Qué significa para vos ser fiel, más allá de no tener relaciones con otra persona?'],
    ['b08','profundas',2,'¿Qué experiencia te hizo cambiar tu forma de entender el amor?'],
    ['b09','intimidad',2,'¿Qué aspecto de nuestra intimidad te gustaría que pudiéramos hablar con más naturalidad?'],

    // ── Infancia y pasado ──────────────────────────────────────────────
    ['n001','infancia',1,'¿Cuál era tu lugar favorito cuando eras {chico|chica} y qué hacías ahí?'],
    ['n002','infancia',1,'¿Qué juego o pasatiempo de tu infancia todavía te hace sonreír al recordarlo?'],
    ['n003','infancia',1,'¿Qué querías ser de grande y qué quedó de ese sueño en vos?'],
    ['n004','infancia',1,'¿Cómo eran los domingos o los días de fiesta en tu casa cuando eras {chico|chica}?'],
    ['n005','infancia',1,'¿Qué olor, comida o canción te lleva de inmediato a tu infancia?'],
    ['n006','infancia',2,'¿Qué aprendiste en tu casa sobre el dinero, para bien o para mal?'],
    ['n007','infancia',2,'¿Cómo se demostraba el cariño en tu familia mientras crecías?'],
    ['n008','infancia',2,'¿Qué cosa de tu crianza querés repetir y cuál preferirías hacer distinto?'],
    ['n009','infancia',2,'¿Qué persona mayor te marcó cuando eras {chico|chica}, y por qué?'],
    ['n010','infancia',2,'¿Cuál es el primer recuerdo que tenés de sentirte realmente {orgulloso|orgullosa} de vos?'],
    ['n011','infancia',1,'¿Cómo eras en la adolescencia y qué te diría hoy esa versión tuya?'],
    ['n012','infancia',2,'¿Qué amistad de tu pasado te dejó algo que todavía llevás con vos?'],
    ['n013','infancia',3,'¿De qué se hablaba poco en tu casa y cómo creés que eso influyó en vos?'],
    ['n014','infancia',1,'¿Qué momento de tu infancia te gustaría volver a vivir por un día?'],
    ['n015','infancia',2,'¿En qué te parecés a alguien de tu familia, aunque a veces te cueste admitirlo?'],
    ['n016','infancia',2,'¿Qué miedo de tu infancia recordás y qué pasó con él con los años?'],
    ['n017','infancia',2,'¿Qué decisión de tu pasado te cambió el rumbo más de lo que esperabas?'],
    ['n018','infancia',3,'¿Qué te hubiera gustado escuchar cuando eras {chico|chica} y nadie te dijo?'],
    ['n019','infancia',3,'Si hubo alguna etapa difícil en tu pasado, ¿qué te enseñó sobre vos?'],
    ['n020','infancia',2,'¿Qué capítulo de tu historia sentís que todavía conozco poco?'],

    // ── Personalidad y emociones ───────────────────────────────────────
    ['n021','personalidad',1,'¿Qué te pone de buen humor casi sin falla?'],
    ['n022','personalidad',2,'¿Cómo te das cuenta de que estás {cansado|cansada} emocionalmente antes de que se note?'],
    ['n023','personalidad',2,'¿Qué hacés cuando necesitás estar {solo|sola} y qué significa para vos ese tiempo?'],
    ['n024','personalidad',2,'¿Qué elogio te cuesta creer cuando te lo dicen?'],
    ['n025','personalidad',2,'¿Cómo reaccionás cuando algo te sale mal, y cómo te gustaría reaccionar?'],
    ['n026','personalidad',1,'¿Qué cosa pequeña te molesta más de lo que te gustaría admitir?'],
    ['n027','personalidad',1,'¿De qué forma solés demostrar cariño sin decirlo con palabras?'],
    ['n028','personalidad',2,'¿Qué emoción te cuesta más mostrar delante de otros?'],
    ['n029','personalidad',2,'¿Qué te da paz cuando tu cabeza no para?'],
    ['n030','personalidad',3,'¿Qué inseguridad tuya te gustaría que yo conociera para entenderte mejor?'],
    ['n031','personalidad',1,'¿Qué rasgo tuyo te enorgullece y casi nunca mencionás?'],
    ['n032','personalidad',3,'¿Qué es lo que más te frustra de vos {mismo|misma}?'],
    ['n033','personalidad',3,'¿En qué situaciones sentís que tenés que mostrarte más {entero|entera} de lo que estás?'],
    ['n034','personalidad',1,'¿Qué te hace reír aunque estés de mal humor?'],

    // ── Amor y relación ────────────────────────────────────────────────
    ['n035','amor',2,'¿Qué momento nuestro te hizo pensar "con esta persona quiero estar"?'],
    ['n036','amor',2,'¿Qué cosa nuestra te gustaría cuidar cuando la rutina se ponga pesada?'],
    ['n037','amor',2,'¿Qué aprendiste de mí que antes no sabías hacer o pensar?'],
    ['n038','amor',3,'¿Qué podría hacer distinto para que te sientas más {acompañado|acompañada}?'],
    ['n039','amor',1,'¿Cómo describirías nuestra relación a alguien que no nos conoce?'],
    ['n040','amor',1,'¿Qué te sorprendió de mí con el tiempo?'],
    ['n041','amor',1,'¿Qué te gusta que haga cuando tenés un día muy bueno?'],
    ['n042','amor',2,'¿Qué idea sobre la pareja tenías antes y cambió estando conmigo?'],
    ['n043','amor',3,'¿Qué podríamos mejorar juntos sin que ninguno tenga que dejar de ser quien es?'],

    // ── Intimidad y sexualidad ─────────────────────────────────────────
    ['n044','intimidad',2,'¿Qué te ayuda a sentirte {cómodo|cómoda} para hablar de intimidad conmigo?'],
    ['n045','intimidad',2,'¿Qué gesto de ternura después de un momento íntimo te gusta más?'],
    ['n046','intimidad',3,'Si algo no te gusta en un momento íntimo, ¿cómo te gustaría decírmelo para que te resulte fácil?'],

    // ── Futuro y proyectos ─────────────────────────────────────────────
    ['n047','futuro',1,'¿Cómo te imaginás un día normal nuestro dentro de cinco años?'],
    ['n048','futuro',2,'¿Qué significa para vos convivir, y qué te entusiasma o te inquieta de eso?'],
    ['n049','futuro',1,'¿Qué lugar del mundo querés conocer en los próximos diez años, y por qué ese?'],
    ['n050','futuro',2,'¿Qué lugar ocupan los hijos en la vida que te imaginás, si es que ocupan alguno?'],
    ['n051','futuro',3,'¿Cómo te gustaría que manejáramos el dinero si algún día compartimos gastos?'],
    ['n052','futuro',2,'¿Qué objetivo personal querés cumplir y cómo te puedo acompañar?'],
    ['n053','futuro',2,'¿Qué lugar querés que ocupe el trabajo en tu vida?'],
    ['n054','futuro',1,'¿Dónde te gustaría vivir si pudieras elegir sin ninguna restricción?'],
    ['n055','futuro',1,'¿Qué cosa de tu vida actual querés que siga igual dentro de diez años?'],
    ['n056','futuro',1,'¿Qué te gustaría que hayamos hecho juntos antes de que termine el año?'],
    ['n057','futuro',3,'¿Qué te inquieta de comprometerte a largo plazo, si es que algo te inquieta?'],
    ['n058','futuro',2,'¿Cómo te imaginás la relación con nuestras familias en el futuro?'],
    ['n059','futuro',2,'¿Cómo te gustaría que fuera tu vejez?'],
    ['n060','futuro',2,'¿Qué decisión importante te gustaría que tomemos juntos este año?'],

    // ── Conflictos y comunicación ──────────────────────────────────────
    ['n061','conflictos',1,'¿Cómo te das cuenta de que estoy {o:enojado|enojada} aunque no lo diga?'],
    ['n062','conflictos',3,'¿Qué frase o tono te lastima más durante una discusión?'],
    ['n063','conflictos',2,'¿Cómo te gusta que te pidan perdón?'],
    ['n064','conflictos',2,'¿Cuánto tiempo necesitás para calmarte antes de hablar algo difícil?'],
    ['n065','conflictos',1,'¿Qué te ayuda a sentirte {escuchado|escuchada} cuando me contás algo?'],
    ['n066','conflictos',3,'¿Qué tema te cuesta sacar porque no sabés cómo lo voy a tomar?'],
    ['n067','conflictos',1,'¿Preferís resolver un desacuerdo en el momento o dejarlo para después? ¿Por qué?'],
    ['n068','conflictos',2,'Mirando a los adultos de tu casa, ¿qué aprendiste sobre cómo se resuelven los desacuerdos?'],
    ['n069','conflictos',2,'¿Qué podemos hacer para que una discusión no se convierta en una pelea?'],
    ['n070','conflictos',1,'Cuando estás de mal humor, ¿qué preferís que haga: acercarme, darte espacio u otra cosa?'],
    ['n071','conflictos',2,'¿Cómo preferís que te diga algo que me molestó?'],
    ['n072','conflictos',3,'¿Qué es lo más difícil para vos a la hora de pedir perdón?'],
    ['n073','conflictos',1,'¿Qué señal podríamos usar para frenar una discusión que se está yendo de las manos?'],
    ['n074','conflictos',3,'¿Qué cosa que dijiste alguna vez sentís que entendí distinto de lo que quisiste decir?'],

    // ── Valores y creencias ────────────────────────────────────────────
    ['n075','valores',2,'¿Qué valor no negociarías por nada?'],
    ['n076','valores',2,'¿Qué significa para vos la libertad dentro de una pareja?'],
    ['n077','valores',3,'¿Qué considerás una falta de respeto aunque para otros sea normal?'],
    ['n078','valores',2,'¿Qué significa para vos comprometerse con alguien?'],
    ['n079','valores',2,'¿Qué lugar ocupan la fe, la espiritualidad o tus creencias en tu vida?'],
    ['n080','valores',1,'¿Qué regla de vida te armaste vos y no te la enseñó nadie?'],
    ['n081','valores',2,'¿Qué opinión tuya cambió con los años y qué te hizo cambiarla?'],
    ['n082','valores',1,'¿Qué es para vos una persona exitosa?'],
    ['n083','valores',3,'¿Qué cosa te resultaría muy difícil de perdonar en una pareja?'],
    ['n084','valores',3,'¿Qué límites te parecen sanos en la relación con exparejas o con personas que te atraen?'],
    ['n085','valores',2,'¿Qué significa para vos la lealtad con la familia, y dónde termina?'],
    ['n086','valores',1,'¿Qué causa o tema del mundo te importa más de lo que la gente imagina?'],
    ['n087','valores',1,'¿Qué pesa más en una pareja para vos: tener cosas en común o respetar las diferencias?'],
    ['n088','valores',3,'¿Cómo vivís la privacidad dentro de la pareja: celular, redes, tiempo propio?'],
    ['n089','valores',2,'¿Qué principio te gustaría que guiara nuestras decisiones como pareja?'],

    // ── Diversión y complicidad ────────────────────────────────────────
    ['n090','diversion',1,'Si pudiéramos vivir un mes en cualquier época de la historia, ¿cuál elegirías y qué haríamos?'],
    ['n091','diversion',1,'¿Qué superpoder elegirías y para qué lo usarías en nuestro día a día?'],
    ['n092','diversion',1,'Si nuestra relación fuera una película, ¿de qué género sería y quiénes nos interpretarían?'],
    ['n093','diversion',2,'¿Cuál es la anécdota más vergonzosa que te animás a contarme hoy?'],
    ['n094','diversion',1,'¿Qué comida elegirías para la cena perfecta y dónde la comeríamos?'],
    ['n095','diversion',1,'Si ganáramos la lotería mañana, ¿qué sería lo primero que harías?'],
    ['n096','diversion',1,'¿Qué costumbre mía te parece graciosa y nunca me lo dijiste?'],
    ['n097','diversion',1,'Imitá algo que digo o hago seguido. ¿Por qué elegiste eso?'],
    ['n098','diversion',1,'¿Qué desafío un poco loco te animarías a hacer conmigo este año?'],
    ['n099','diversion',1,'¿Qué talento escondido tenés que todavía no me mostraste?'],
    ['n100','diversion',1,'Si tuvieras que organizarme una sorpresa con muy poca plata, ¿qué harías?'],
    ['n101','diversion',1,'¿Qué es lo más espontáneo que hiciste en tu vida?'],
    ['n102','diversion',1,'Si pudieras cambiar una regla del mundo por un día, ¿cuál cambiarías?'],
    ['n103','diversion',2,'¿Qué cosa te gusta aunque te dé un poco de vergüenza admitirlo?'],

    // ── Preguntas profundas ────────────────────────────────────────────
    ['n104','profundas',2,'¿En qué momento de tu vida sentiste que te convertiste en {adulto|adulta}?'],
    ['n105','profundas',2,'¿Qué es para vos la felicidad hoy, y cómo cambió esa idea con los años?'],
    ['n106','profundas',2,'Si tuvieras que elegir un error que te enseñó mucho, ¿cuál sería?'],
    ['n107','profundas',3,'¿Qué cosa de vos conocen muy pocas personas?'],
    ['n108','profundas',3,'¿En qué momentos te sentís {solo|sola}, aun estando {acompañado|acompañada}?'],
    ['n109','profundas',2,'¿Qué te gustaría que la gente dijera de vos cuando no estás?'],
    ['n110','profundas',2,'¿Qué cambió en vos en los últimos años que te pone {orgulloso|orgullosa}?'],
    ['n111','profundas',2,'¿Qué pregunta sobre la vida todavía no podés responderte?'],
    ['n112','profundas',2,'¿Qué decisión importante tomaste con miedo y salió mejor de lo que esperabas?'],
    ['n113','profundas',2,'¿Qué te da sentido cuando las cosas no salen como querías?'],
    ['n114','profundas',3,'¿Qué parte tuya estás aprendiendo a aceptar?'],
    ['n115','profundas',1,'Si pudieras hablar cinco minutos con tu yo de hace diez años, ¿qué le dirías?'],
    ['n116','profundas',2,'¿Qué te gustaría dejar en el mundo cuando ya no estés?'],
    ['n117','profundas',2,'¿Qué te asusta de envejecer y qué te entusiasma?'],
    ['n118','profundas',3,'¿Qué es lo que más te cuesta perdonarte?'],
    ['n119','profundas',3,'¿Cuándo fue la última vez que lloraste y qué lo provocó?'],
    ['n120','profundas',2,'¿Qué creías seguro sobre vos y resultó no ser cierto?'],
    ['n121','profundas',1,'¿Qué es lo más valiente que hiciste?'],
    ['n122','profundas',2,'¿Qué significa para vos estar en paz con uno mismo?'],

    // ── Deseos y secretos ──────────────────────────────────────────────
    ['n123','deseos',2,'¿Qué sueño postergaste y todavía te gustaría cumplir?'],
    ['n124','deseos',3,'¿Qué cosa nunca le contaste a nadie y te animarías a contarme hoy?'],
    ['n125','deseos',3,'¿Qué pensamiento sobre nosotros tuviste y nunca dijiste en voz alta?'],
    ['n126','deseos',2,'¿Qué te animarías a hacer si no te importara lo que piensen los demás?'],
    ['n127','deseos',1,'¿Qué experiencia te gustaría vivir conmigo por primera vez?'],
    ['n128','deseos',1,'¿Qué placer culposo tenés que te da un poco de vergüenza confesar?'],
    ['n129','deseos',3,'¿Qué deseo tuyo sentís que nunca me pediste?'],
    ['n130','deseos',2,'¿Qué te gustaría que supiera de vos sin que tengas que decírmelo?'],
    ['n131','deseos',1,'¿Qué secreto inofensivo de tu pasado te animás a revelar?'],
    ['n132','deseos',2,'¿Qué le dirías hoy a alguien que ya no está en tu vida?'],
    ['n133','deseos',2,'¿Qué meta tenés guardada porque temés que suene demasiado grande?'],
    ['n134','deseos',1,'¿Qué te gustaría que te regalara sin ningún motivo?']
  ];

  var QUESTIONS = Q.map(function (r) {
    return { id: r[0], cat: r[1], lvl: r[2], text: r[3], custom: false };
  });

  var data = { categories: CATEGORIES, levels: LEVELS, questions: QUESTIONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.CATALOG = data;
})(this);
