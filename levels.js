const startLevel = 1;

const levels = [
	{ // test level, doesn't play (unless you set the previous const to 0)
		start: [50, 50],
		end: [550, 375],
		boxes: [ // [x, y, width]
			[50, 300, 100],
			[150, 277, 200],
			[400, 20, 100]
		],
		text: "Sometimes a KEY is required in order to pass a LEVEL.",
		lava: [ // [x, y, width, height]
		]
	}, {//1
		start: [25, 400],
		end: [550, 425],
		boxes: [
			[0, 450, 600],
		],
		text: "Reach the GOAL to finish the LEVEL.",
	}, {//2
		start: [25, 200],
		end: [550, 375],
		boxes: [
			[0, 250, 250],
			[300, 400, 300],
		],
		text: "Avoid contact with RED LAVA.",
		lava: [
			[0, 500, 600, 100]
		]
	}, {//3
		start: [25, 200],
		end: [550, 225],
		boxes: [
			[0, 250, 200],
			[300, 250, 300],
		],
		text: "Press the UP ARROW to JUMP.",
		lava: [
			[0, 500, 600, 100]
		]
	}, {//4
		start: [25, 400],
		end: [550, 75],
		boxes: [
			[0, 450, 250],
			[400, 450, 200],
			[0, 100, 600]
		],
		text: "Falling through the FLOOR loops you to the top.",
		lava: [
			[]
		]
	}, {//5
		start: [25, 400],
		end: [550, 325],
		boxes: [
			[0, 450, 600],
			[0, 350, 600]
		],
		text: "You can jump upwards through BLOCKS.",
		lava: [
			[]
		]
	}, {//6
		start: [25, 200],
		end: [550, 325],
		boxes: [
			[0, 250, 150],
			[450, 350, 150],
		],
		text: "Falling off a LEDGE allows you 1 AIR JUMP.",
		lava: [
			[290, 0, 20, 200],
			[0, 500, 600, 100]
		],
	}, {//7
		start: [25, 300],
		end: [550, 325],
		boxes: [
			[0, 350, 150],
			[450, 350, 150],
		],
		text: "Sometimes one or more KEYs are required.",
		lava: [
			[0, 500, 600, 100]
		],
		keys: [
			[75, 200],
			[300, 200]
		]
	}, {//8
		start: [25, 200],
		end: [550, 225],
		boxes: [
			[0, 250, 100],
			[100, 410, 100],
			[200, 250, 400],
		],
		text: "You can utilize bouncing to get a higher AIR JUMP.",
		lava: [
			[0, 500, 600, 100]
		],
		keys: [
			[150, 390]
		]
	}, {//9
		start: [25, 150],
		end: [50, 375],
		boxes: [
			[0, 200, 530],
			[0, 410, 110],
		],
		text: "Bounce off the WALLs to change direction quickly.",
		lava: [
			[0, 500, 600, 100]
		],
	}, {//10
		start: [0, 300],
		end: [575, 325],
		boxes: [
			[0, 350, 50],
			[500, 350, 100],
		],
		text: "PORTALS provide quick one-way transport.",
		lava: [
			[0, 500, 600, 100]
		],
		portals: [[[25, 200], [525, 200]]]
	}, {"start":[233,287],"end":[312,453],"boxes":[[205,337,105],[265,482,95],[428,259,115]],"text":"Good luck with this one.","lava":[[112,352,52,62],[420,316,54,41]],"keys":[[482,185],[54,254]]}, // 10
	
	
{}];

