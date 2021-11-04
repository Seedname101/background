function printMousePos(event) {
  console.log("(" + event.clientX + "," + event.clientY + ")" );
}  

document.addEventListener("click", printMousePos);


var sketchProc = function(processingInstance) {
     with (processingInstance) {
        size(screen.width, screen.height); 
        frameRate(60);
        
        function Mountain(x, w, h) {
            this.x = x;
            this.s = new PVector(w, h);

            this.display = function() {
                triangle(this.x, height, x+this.s.x, height, x+this.s.x/2, height-this.s.y);
            };
            this.getSides = function() {
                var x = this.x;
                var w = this.s.x;
                var h = this.s.y;

                function f(t) {
                    return (2*h/w)*(t-x);
                }

                function g(t) {
                    return 2*h*((x-t)/w + 1);
                }
                return [[f, x, x+w/2], [g, x+w/2, x+w]];
            };
        }

        function Snow(x, y, size, velocity, lifespan) {
            this.position = new PVector(x, y);
            this.velocity = velocity.get();
            this.size = size;
            this.life = 0;
            this.lifespan = lifespan;

            this.display = function() {
               fill(255, 255, 255, map(this.life, 0, this.lifespan, 255, 0));
                noStroke();
                ellipse(this.position.x, this.position.y, this.size, this.size);
            };

            this.update = function() {
                this.position.add(this.velocity);
                this.life += 1/60;
            };
        }

        function Blizzard(amount, frequency, velocity, lifespan) {
            this.snow = [];
            this.velocity = velocity;
            this.amount = amount;
            this.frequency = frequency;
            this.lifespan = lifespan;

            this.update = function() {

                for(var i = 0; i < this.amount; i++) {
                    if(frameCount % this.frequency === 0) {
                        this.snow.push( new Snow(random(-height/(this.velocity.y/this.velocity.x), width), random(20), random(3, 5), this.velocity, this.lifespan) );
                    }
                }

                for(var i = 0; i < this.snow.length; i++) {
                    this.snow[i].update();
                    if(this.snow[i].position.y >  height || this.snow[i].position.y > width || this.snow[i].life > this.lifespan) {
                      this.snow.splice(i, 1);
                    }
                }
            };

            this.display = function() {
                for(var i = 0; i < this.snow.length; i++) {
                    this.snow[i].display();
                }
            };

            this.collidesWith = function(f, lower, upper, vel) {

                var mag = sqrt(sq(upper-lower) + sq(f(upper)-f(lower)));

                for(var i = 0; i < this.snow.length; i++) {

                    if(round(f(this.snow[i].position.x)) >= round(height-this.snow[i].position.y)-this.snow[i].size && this.snow[i].position.x > lower && this.snow[i].position.x < upper){
                        this.snow[i].velocity.set((upper - lower)/mag* (f(lower) - f(upper))/Math.abs(f(lower)-f(upper)), Math.abs((f(lower) - f(upper))/mag));

                    }
                }
            };

            this.addSnow = function(x, y){ 
                this.snow.push(new Snow(x, y, random(3, 5), this.velocity, this.lifespan));
            };

        }

        var mountain1  = new Mountain(200, 300, 100);
        var mountain2  = new Mountain(width-200, 300, 186);

        var blizzard = new Blizzard(10, 5, new PVector(2, 5), 3);

        var sides1 = mountain1.getSides();
        var sides2 = mountain2.getSides();

        draw = function() {
            background(129, 222, 129);
            fill(0);
            stroke(0);

            mountain1.display();
            mountain2.display();

            blizzard.display();
            blizzard.update();

            blizzard.collidesWith(sides1[0][0], sides1[0][1], sides1[0][2]);
            blizzard.collidesWith(sides1[1][0], sides1[1][1], sides1[1][2]);

            blizzard.collidesWith(sides2[0][0], sides2[0][1], sides2[0][2]);
            blizzard.collidesWith(sides2[1][0], sides2[1][1], sides2[1][2]);


        };

        function mousePressed() {
            blizzard.addSnow(mouseX, mouseY);
        }

        function mouseDragged() {
            blizzard.addSnow(mouseX, mouseY);
        }
    }};

    var canvas = document.getElementById("bckgrnd"); 

    var processingInstance = new Processing(canvas, sketchProc); 
