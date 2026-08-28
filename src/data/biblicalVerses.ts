import { BibleVerse } from '../types';

export const biblicalVerses: BibleVerse[] = [
  {
    id: '1',
    text: '«El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso. No se comporta con rudeza, no es egoísta, no se enoja fácilmente, no guarda rencor... Todo lo disculpa, todo lo cree, todo lo espera, todo lo soporta. El amor jamás se extingue.»',
    reference: '1 Corintios 13:4-8',
    theme: 'La excelencia del amor verdadero',
  },
  {
    id: '2',
    text: '«Las muchas aguas no podrán apagar el amor, ni lo ahogarán los ríos. Si diese el hombre todos los bienes de su casa por este amor, de cierto sería menospreciado.»',
    reference: 'Cantares 8:7',
    theme: 'La fuerza inagotable del amor',
  },
  {
    id: '3',
    text: '«Mejor son dos que uno, porque tienen mejor paga por su trabajo. Porque si cayeren, el uno levantará a su compañero... Y si alguno prevaleciere contra uno, dos le resistirán; y cordón de tres dobleces no se rompe pronto.»',
    reference: 'Eclesiastés 4:9-12',
    theme: 'La bendición de caminar juntos y con Dios',
  },
  {
    id: '4',
    text: '«Y sobre todas estas cosas vestíos de amor, que es el vínculo perfecto.»',
    reference: 'Colosenses 3:14',
    theme: 'El vínculo de la perfección',
  },
  {
    id: '5',
    text: '«Nosotros le amamos a él, porque él nos amó primero. Amémonos unos a otros, porque el amor es de Dios.»',
    reference: '1 Juan 4:19, 7',
    theme: 'El amor como reflejo divino',
  },
  {
    id: '6',
    text: '«No me ruegues que te deje, y me aparte de ti; porque a dondequiera que tú fueres, iré yo, y dondequiera que vivieres, viviré. Tu pueblo será mi pueblo, y tu Dios mi Dios.»',
    reference: 'Rut 1:16',
    theme: 'La fidelidad y el compromiso eterno',
  },
  {
    id: '7',
    text: '«El que halla esposa halla el bien, y alcanza la benevolencia del Señor.»',
    reference: 'Proverbios 18:22',
    theme: 'La gracia del matrimonio',
  },
  {
    id: '8',
    text: '«Por tanto, lo que Dios juntó, no lo separe el hombre.»',
    reference: 'Marcos 10:9',
    theme: 'La sagrada unión nupcial',
  },
  {
    id: '9',
    text: '«Grábame como un sello sobre tu corazón, como un sello sobre tu brazo; porque fuerte es como la muerte el amor.»',
    reference: 'Cantares 8:6',
    theme: 'El sello del amor en el alma',
  },
];

export const getRandomVerse = (currentId?: string): BibleVerse => {
  const filtered = currentId ? biblicalVerses.filter((v) => v.id !== currentId) : biblicalVerses;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};
