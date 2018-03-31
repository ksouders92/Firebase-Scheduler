
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDNcyo8ZSitbjSlXArRf8xbxZQGlD4qu48",
        authDomain: "homework-7-6f99b.firebaseapp.com",
        databaseURL: "https://homework-7-6f99b.firebaseio.com",
        projectId: "homework-7-6f99b",
        storageBucket: "homework-7-6f99b.appspot.com",
        messagingSenderId: "304384094311"
    };
    firebase.initializeApp(config);

    var db = firebase.database();

    function addScheduleRow(train) {

        var mins_away = calculateMinutesAway(train.start_time, train.frequency);
        var next_arrival = calculateNextArrival(mins_away);
    
        var $name_data = $('<td>').html( train.name );
        var $dest_data = $('<td>').html( train.destination );
        var $freq_data = $('<td>').html( train.frequency );
        var $next_data = $('<td>').html( next_arrival );
        var $mins_data = $('<td>').html( mins_away );
    
        var $table_row = $('<tr>').append( $name_data,
                                           $dest_data,
                                           $freq_data,
                                           $next_data,
                                           $mins_data );
    
        $('#schedule-data').append($table_row);
    }
    function calculateMinutesAway(start, freq) {

        var first_train = moment(start, 'hh:mm');
        var difference = moment().diff(moment(first_train), 'minutes');
        var remainder = difference % freq;
        var minutes_away = freq - remainder;
    
        return minutes_away;
    }
    
    function calculateNextArrival(mins_away) {
    
        var next = moment().add(mins_away, 'minutes');
    
        return moment(next).format("hh:mm");
    }
    
    $(document).ready(function() {
    
        $('#add-button').on('click', function(event) {
    
            event.preventDefault();
    
            var name = $('#add-name').val().trim();
            var dest = $('#add-destination').val().trim();
            var time = $('#add-start-time').val().trim();
            var freq = $('#add-frequency').val().trim();
    
            // TODO: FORM INPUT VALIDATIONS
    
            var train = {
                name: name,
                destination: dest,
                start_time : time,
                frequency : freq
            };
    
            db.ref('/trains').push(train);
    
            $('.form-control').val('');
        });
    
    
        db.ref('/trains').on('child_added', function(data) {
    
            var train = {
                uid : data.key,
                name : data.val().name,
                destination : data.val().destination,
                start_time : data.val().start_time,
                frequency : data.val().frequency
            };
    
            addScheduleRow(train);
        });
    });