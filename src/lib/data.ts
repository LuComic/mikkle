export interface worker {
	name: string;
	goto: 'burst' | 'yotl' | 'tokyo' | 'other';
	burger: 'Katsu Sando' | 'Cheeseburger' | 'Lil Major';
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
		image: '/pictures/jakob.png'
	},
	{
		name: 'Emily',
		goto: 'tokyo',
		burger: 'Cheeseburger',
		hint: 'tema sall leidis uue elutee',
		period: 'new',
		image: '/pictures/emily.png'
	},
	{
		name: 'Tom',
		goto: 'burst',
		burger: 'Cheeseburger',
		hint: 'Põhjala laager + badpenpal',
		period: 'old',
		image: '/pictures/tom.png'
	},
	{
		name: 'Liisa Lotta',
		goto: 'tokyo',
		burger: 'Cheeseburger',
		hint: "'ma olen nii räpne' üks ohver",
		period: 'old',
		image: '/pictures/liisa.png'
	},
	{
		name: 'Grethe',
		goto: 'other',
		burger: 'Cheeseburger',
		hint: 'Ringo Starr',
		period: 'new',
		image: '/pictures/grethe.png'
	},
	{
		name: 'Mona',
		goto: 'other',
		burger: 'Katsu Sando',
		hint: 'Kalamaja OG',
		period: 'new',
		image: '/pictures/mona.png'
	},
	{
		name: 'Iris',
		goto: 'other',
		burger: 'Cheeseburger',
		hint: 'Katjes Party Fred',
		period: 'old',
		image: '/pictures/iris.png'
	},
	{
		name: 'Lukas',
		goto: 'other',
		burger: 'Katsu Sando',
		hint: 'Beef 0.3L klaasidega',
		period: 'new',
		image: '/pictures/lukas.png'
	},
	{
		name: 'Puju',
		goto: 'other',
		burger: 'Lil Major',
		hint: 'Vanaema moos',
		period: 'old',
		image: '/pictures/puju.png'
	}
];
