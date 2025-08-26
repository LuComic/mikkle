export interface worker {
	name: string;
	goto: 'burst' | 'yotl' | 'tokyo' | 'varia';
	hint: string;
	period: 'new' | 'old';
	image: string;
}

export const workers: worker[] = [
	{
		name: 'Jakob',
		goto: 'burst',
		hint: 'VIHKAB arbuusi',
		period: 'old',
		image: 'src/lib/pictures/jakob.png'
	},
	{
		name: 'Emily',
		goto: 'tokyo',
		hint: 'tema sall leidis uue elutee',
		period: 'new',
		image: 'src/lib/pictures/emily.png'
	},
	{
		name: 'Tom',
		goto: 'burst',
		hint: 'põhjala laager + badpenpal',
		period: 'old',
		image: 'src/lib/pictures/tom.png'
	},
	{
		name: 'Liisa Lotta',
		goto: 'tokyo',
		hint: "'ma olen nii räpne' üks ohver",
		period: 'new',
		image: 'src/lib/pictures/liisa.png'
	},
	{
		name: 'Grethe',
		goto: 'varia',
		hint: 'Ringo Starr',
		period: 'new',
		image: 'src/lib/pictures/grethe.png'
	},
	{
		name: 'Mona',
		goto: 'varia',
		hint: 'Kalamaja OG',
		period: 'new',
		image: 'src/lib/pictures/mona.png'
	},
	{
		name: 'Iris',
		goto: 'varia',
		hint: 'Katjes Party Fred',
		period: 'old',
		image: 'src/lib/pictures/iris.png'
	}
];
