export interface worker {
	name: string;
	goto: 'burst' | 'yotl' | 'tokyo' | 'varia';
	burger: 'Katsu Sando' | 'Cheeseburger';
	hint: string;
	period: 'new' | 'old';
	image: string;
}

export const workers: worker[] = [
	{
		name: 'Jakob',
		goto: 'burst',
		burger: 'Katsu Sando',
		hint: 'VIHKAB arbuusi',
		period: 'old',
		image: 'src/lib/pictures/jakob.png'
	},
	{
		name: 'Emily',
		goto: 'tokyo',
		burger: 'Cheeseburger',
		hint: 'tema sall leidis uue elutee',
		period: 'new',
		image: 'src/lib/pictures/emily.png'
	},
	{
		name: 'Tom',
		goto: 'burst',
		burger: 'Cheeseburger',
		hint: 'põhjala laager + badpenpal',
		period: 'old',
		image: 'src/lib/pictures/tom.png'
	},
	{
		name: 'Liisa Lotta',
		goto: 'tokyo',
		burger: 'Cheeseburger',
		hint: "'ma olen nii räpne' üks ohver",
		period: 'old',
		image: 'src/lib/pictures/liisa.png'
	},
	{
		name: 'Grethe',
		goto: 'varia',
		burger: 'Cheeseburger',
		hint: 'Ringo Starr',
		period: 'new',
		image: 'src/lib/pictures/grethe.png'
	},
	{
		name: 'Mona',
		goto: 'varia',
		burger: 'Katsu Sando',
		hint: 'Kalamaja OG',
		period: 'new',
		image: 'src/lib/pictures/mona.png'
	},
	{
		name: 'Iris',
		goto: 'varia',
		burger: 'Cheeseburger',
		hint: 'Katjes Party Fred',
		period: 'old',
		image: 'src/lib/pictures/iris.png'
	}
];
