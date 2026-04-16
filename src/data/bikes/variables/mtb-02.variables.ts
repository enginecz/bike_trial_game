export type BikeVariableValue = number | string | boolean;

export interface BikeDefinitionVariable {
  name: string;
  description: string;
  value: BikeVariableValue;
  unit?: string;
  notes?: string;
}

// This file is the source list of variables from which we will later
// generate the tuning + rendering definition for bike presets.
//
// Workflow:
// 1. Add variables for the specific bike here over time.
// 2. For each variable, keep the name, explanation, and value.
// 3. Once the list is complete, generate the new mtb-02 definition from it.
// 4. For the next bike (for example mtb-03), copy this file and adjust values.
//
// Recommended field usage:
// - `name`: short stable identifier that we will reuse
// - `description`: what the variable means exactly
// - `value`: concrete value for mtb-02
// - `unit`: optional unit, for example m, rad, kg-equivalent, N*m
// - `notes`: optional extra detail when needed

export const mtb02Variables: BikeDefinitionVariable[] = [
  {
    name: 'reach',
    description: 'Reach of frame = X coordinate of the head point of the frame triangle.',
    value: 504,
    unit: 'mm',
  },
  {
    name: 'stack',
    description: 'Stack of frame = Y coordinate of the head point of the frame triangle.',
    value: 648,
    unit: 'mm',
  },
  {
    name: 'seat_tube',
    description: 'Seat tube length = length of the seat side of the frame triangle.',
    value: 457,
    unit: 'mm',
  },
  {
    name: 'seat_angle_ef',
    description: 'Effective angle of seat tube = angle between horizontal and the seat side of the frame triangle measured in the -X +Y sector.',
    value: 76,
    unit: 'deg',
  },
  {
    name: 'head_angle',
    description: 'Head angle = angle between horizontal and head axis measured in the -X +Y sector.',
    value: 64,
    unit: 'deg',
  },
  {
    name: 'head_tube',
    description: 'Head tube length = distance between the head point of the frame triangle and the beginning of the front suspension point on the head axis.',
    value: 130,
    unit: 'mm',
  },
  {
    name: 'front_sus_travel',
    description: 'Travel of front suspension = no-load distance between beginning and end of front suspension = maximum shortening of front suspension, therefore full-load distance is zero.',
    value: 160,
    unit: 'mm',
    notes: 'By naming logic this would also correspond to front_sus_length, but that would duplicate the same value, so only one variable is kept.',
  },
  {
    name: 'front_sus_rate',
    description: 'Approximate spring stiffness of front suspension fork linearized around normal sag.',
    value: 7800,
    unit: 'N/m',
    notes: 'Order-of-magnitude value derived from published MTB fork characterization, approximately corresponding to a 70 psi fork around 30% sag for 160 mm travel.',
  },
  {
    name: 'fork_offset',
    description: 'Perpendicular distance of the center point of the front wheel from the head axis.',
    value: 42,
    unit: 'mm',
  },
  {
    name: 'pivot_x',
    description: 'X coordinate of swingarm pivot point.',
    value: 20,
    unit: 'mm',
  },
  {
    name: 'pivot_y',
    description: 'Y coordinate of swingarm pivot point.',
    value: 70,
    unit: 'mm',
  },
  {
    name: 'rear_sus_x',
    description: 'X coordinate of rear suspension beginning in frame.',
    value: 180,
    unit: 'mm',
  },
  {
    name: 'rear_sus_y',
    description: 'Y coordinate of rear suspension beginning in frame.',
    value: 280,
    unit: 'mm',
  },
  {
    name: 'rear_sus_length',
    description: 'No-load length of rear suspension = maximum distance between the rear suspension beginning in frame and the rear suspension end in swingarm.',
    value: 205,
    unit: 'mm',
  },
  {
    name: 'rear_sus_travel',
    description: 'Travel of rear suspension = maximum shortening of rear suspension from its no-load length.',
    value: 60,
    unit: 'mm',
  },
  {
    name: 'rear_sus_rate',
    description: 'Spring rate of rear suspension.',
    value: 450,
    unit: 'lb/in',
  },
  {
    name: 'rear_sus_comp_damping',
    description: 'Compression damping coefficient of rear suspension shock.',
    value: 403,
    unit: 'N*s/m',
    notes: 'Order-of-magnitude starting value based on published experimental MTB shock characterization.',
  },
  {
    name: 'rear_sus_rebound_damping',
    description: 'Rebound damping coefficient of rear suspension shock.',
    value: 2155,
    unit: 'N*s/m',
    notes: 'Order-of-magnitude starting value based on published experimental MTB shock characterization.',
  },
  {
    name: 'swing_pivot_sus',
    description: 'Distance on swingarm triangle between pivot point and suspension point.',
    value: 230,
    unit: 'mm',
  },
  {
    name: 'chainstay',
    description: 'Negative X coordinate of rear wheel center in no-load state.',
    value: 469,
    unit: 'mm',
  },
  {
    name: 'bb_drop',
    description: 'Y coordinate of rear wheel center in no-load state.',
    value: 35,
    unit: 'mm',
  },
  {
    name: 'wheelbase',
    description: 'X distance between front and rear wheel center in no-load state.',
    value: 1293,
    unit: 'mm',
  },
  {
    name: 'wheel_front_dia',
    description: 'Outer diameter of front wheel.',
    value: 29,
    unit: 'in',
  },
  {
    name: 'wheel_rear_dia',
    description: 'Outer diameter of rear wheel.',
    value: 29,
    unit: 'in',
  },
  {
    name: 'front_sus_comp_damping',
    description: 'Compression damping coefficient of front suspension fork.',
    value: 162,
    unit: 'N*s/m',
    notes: 'Order-of-magnitude starting value based on published experimental MTB fork characterization.',
  },
  {
    name: 'front_sus_rebound_damping',
    description: 'Rebound damping coefficient of front suspension fork.',
    value: 228,
    unit: 'N*s/m',
    notes: 'Order-of-magnitude starting value based on published experimental MTB fork characterization.',
  },
  {
    name: 'frame_mass',
    description: 'Target physical mass of the main frame body.',
    value: 3.2,
    unit: 'kg',
  },
  {
    name: 'swingarm_mass',
    description: 'Target physical mass of the swingarm body.',
    value: 1.8,
    unit: 'kg',
  },
  {
    name: 'fork_mass',
    description: 'Target physical mass of the fork body.',
    value: 2.4,
    unit: 'kg',
  },
  {
    name: 'rear_wheel_mass',
    description: 'Target physical mass of the rear wheel body.',
    value: 2.1,
    unit: 'kg',
  },
  {
    name: 'front_wheel_mass',
    description: 'Target physical mass of the front wheel body.',
    value: 1.9,
    unit: 'kg',
  },
  {
    name: 'rider_mass',
    description: 'Target physical mass of the rider body used by the simulation.',
    value: 82,
    unit: 'kg',
    notes: 'This is the rider mass target represented by the simplified rider body used by the simulation.',
  },
];
