ERGAST:
-Main: http://ergast.com/api/f1/

-Season List: http://ergast.com/api/f1/seasons

-Circuit List: 
    All time: http://ergast.com/api/f1/circuits
    Specific season: http://ergast.com/api/f1/<season>/circuits
    Specific round: http://ergast.com/api/f1/<season>/<round>/circuits

    Additional Info:
        /constructors/<constructorId>
        /drivers/<driverId>
        /grid/<position>
        /results/<position>
        /fastest/<rank>
        /status/<statusId>

        +/circuits

-Drivers List:
    All time: http://ergast.com/api/f1/drivers
    Specific season: http://ergast.com/api/f1/<season>/drivers
    Specific round: http://ergast.com/api/f1/<season>/<round>/drivers

    Additional Info:
        /circuits/<circuitId>
        /constructors/<constructorId>
        /drivers/<driverId>
        /grid/<position>
        /results/<position>
        /fastest/<rank>
        /status/<statusId>

        +/drivers

    To get drivers that got a specific position in the championship:
        http://ergast.com/api/f1/driverStandings/<position>/drivers 

-Constructors List:
    All time: http://ergast.com/api/f1/constructors
    Specific season: http://ergast.com/api/f1/<season>/constructors
    Specific round: http://ergast.com/api/f1/<season>/<round>/constructors

    Additional Info:
        /circuits/<circuitId>
        /constructors/<constructorId>
        /drivers/<driverId>
        /grid/<position>
        /results/<position>
        /fastest/<rank>
        /status/<statusId>

        +/constructors

Lap Times:
    By lap: http://ergast.com/api/f1/<season>/<round>/laps/<lapNumber>
    By driver: http://ergast.com/api/f1/<season>/<round>/drivers/<driverId>/laps/

Pit Stops:
    By round: http://ergast.com/api/f1/<season>/<round>/pitstops
    By driver: http://ergast.com/api/f1/<season>/<round>/drivers/<driverId>/pitstops
    By lap: http://ergast.com/api/f1/<season>/<round>/laps/<lapNumber>/pitstops


